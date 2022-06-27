import React, { useState, useContext, useEffect } from 'react'
import { Image, ScrollView, Platform, StyleProp, ViewStyle, View, StyleSheet } from 'react-native'
import Screen from '../components/Screen'
import FormField from '../components/FormField'
import {
    Text,
    Button,
    ActivityIndicator,
    DisplayError,
    ScreenContext
} from '../components'
import {
    createUserWithEmailAndPassword,
    firebaseAuth,
    FirebaseError,
    getApp,
    getAuth,
    GoogleAuthProvider,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from '../database/firebase'
import functions from '@react-native-firebase/functions';
import { Formik, FormikHelpers, FormikProps, useFormik } from 'formik'
import * as Yup from 'yup'
import { FirebaseContext } from '../database/firebase/FirebaseContext'
import { Styles } from '../app/Styles'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from 'react-native-elements'
import { GradientColors } from '../app/GradientColors'
import useGoogleAuth from '@hooks/useGoogleAuth'

interface AuthenticationProps {
    navigation: StackNavigationProp<any>
    customToken?: string
}

interface AuthenticationFields {
    displayName: string
    eMail: string
    password: string
    confirmPassword: string
}

function equalTo(ref: any, msg: any) {
    return Yup.mixed().test({
        name: 'equalTo',
        exclusive: false,
        message: msg || '${path} must be the same as ${reference}',
        params: {
            reference: ref.path,
        },
        test: function (value: any) {
            return value === this.resolve(ref);
        },
    });
}
// @ts-ignore
Yup.addMethod(Yup.string, 'equalTo', equalTo);

const PasswordResetScheme = Yup.object({
    eMail: Yup.string()
        .required('E-mail is a required field')
        .email('Please enter a valid e-mail address')
})

const LoginScheme = Yup.object({
    eMail: Yup.string()
        .required('E-mail is a required field')
        .email('Please enter a valid e-mail address'),
    password: Yup.string()
        .required('Password is a required field')
        .min(8),
})

const RegistrationScheme = Yup.object({
    displayName: Yup.string()
        .required('Full name is a required field')
        .min(3),
    eMail: Yup.string()
        .required('E-mail is a required field')
        .email('Please enter a valid e-mail address')
        .matches(/^((?!@gmail.com).)*$/igm, 'Use the Google Sign-In button to automatically sign-in with your Google'),
    password: Yup.string()
        .required('Password is a required field')
        .min(8),
    confirmPassword: Yup.string()
        // @ts-ignore
        .equalTo(Yup.ref('password'), 'Both passwords must match')
        .required('Please retype your password')
})

export const Authentication = ({ navigation, customToken }: AuthenticationProps) => {
    const { setProfile: firestoreSetProfile, currentUser } = useContext(FirebaseContext)
    const [mode, setMode] = useState<'login' | 'register' | 'password-reset'>('login')
    const [scheme, setScheme] = useState<object>()
    const [submitted, setSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(undefined)
    const { activeTheme, setActiveTheme, isKeyboardOpen, keyboardHeight, screenOrientation, windowSize: window } = useContext(ScreenContext)
    const { width, height } = window ? window : { width: 0, height: 0 }
    const [screenStyle, setScreenStyle] = useState<StyleProp<ViewStyle>>({
        height, width, position: 'absolute'
    })

    const [googleIsAuthenticating, googleErrorMessage, googleSignIn] = useGoogleAuth();

    // useEffect(() => {
    //     functions()
    //       .httpsCallable('listProducts')()
    //       .then(response => {
    //           console.log(response);
    //       });
    //   }, []);

    useEffect(() => {
        if (currentUser)
            navigation.replace('Main')
    }, [currentUser])

    const softReset = (formikProps: FormikProps<any>) => {
        formikProps.setValues({
            displayName: '',
            eMail: formikProps.values.eMail,
            password: '',
            confirmPassword: ''
        })
        formikProps.setTouched({
            displayName: false,
            eMail: false,
            password: false,
            confirmPassword: false
        })
        formikProps.setErrors({
            displayName: undefined,
            eMail: undefined,
            password: undefined,
            confirmPassword: undefined
        })
    }

    const onSignUpPress = (formikProps: FormikProps<any>) => {
        setMode('register')
        softReset(formikProps)
    }

    const onGotoLoginPress = (formikProps: FormikProps<any>) => {
        setMode('login')
        softReset(formikProps)
    }

    const onRegisterPress = async (values: AuthenticationFields, helpers: FormikHelpers<any>) => {
        const setProfile = async () => {
            console.log(values)
            await firestoreSetProfile({
                displayName: values.displayName
            })
            navigation.navigate('LoginActivity')
        }

        createUserWithEmailAndPassword(getAuth(), values.eMail, values.password)
            .then(() => {
                setIsLoading(true)
            })
            .then(setProfile)
            .catch((error: FirebaseError) => {
                setSubmitted(false)
                setIsLoading(false)
                alert(error.message)
            })
    }

    const onLoginPress = async (values: AuthenticationFields, helpers: FormikHelpers<any>) => {
        setSubmitted(true)
        try {
            await signInWithEmailAndPassword(getAuth(), values.eMail, values.password)
            navigation.navigate('LoginActivity')
        }
        catch (error) {
            setSubmitted(false)
            alert(error)
        }
    }

    const sendPasswordReset = (values: AuthenticationFields, helpers: FormikHelpers<any>) => {
        setSubmitted(true)
        sendPasswordResetEmail(getAuth(), values.eMail)
            .then(() => {
                setMode('login')
                setSubmitted(false)
            })
            .catch((error) => {
                alert(error)
                setSubmitted(false)
            })
    }

    // useEffect(() => {
    //     if (activeTheme === 'Dark') setActiveTheme('Light')
    // })

    useEffect(() => {
        // if (customToken) {
        //     auth.signInWithCustomToken(customToken)
        //         .then(() => {
        //             navigation.navigate('LoginActivity')
        //         })
        //         .catch((error) => {
        //             alert('Invalid custom token specified')
        //             setIsLoading(false)
        //         })
        // } else {
            setIsLoading(false)
        // }
    }, [])

    useEffect(() => {
        switch (mode) {
            case 'login':
                setScheme(LoginScheme)
                break
            case 'register':
                setScheme(RegistrationScheme)
                break
            case 'password-reset':
                setScheme(PasswordResetScheme)
        }

    }, [mode])

    useEffect(() => {
        if (isKeyboardOpen && height) {
            setScreenStyle({
                height: height - keyboardHeight, width, position: 'absolute'
            })
        } else {
            setScreenStyle({
                height, width, position: 'absolute'
            })
        }
    }, [isKeyboardOpen, keyboardHeight, screenOrientation, width, height])

    if (isLoading) {
        return <ActivityIndicator fullscreen={true} />
    } else if (error) {
        return <DisplayError error={error} />
    } else {
        return (
            <Screen navigation={navigation} title=''>
                    <View style={{ flex: 1 }}>
                        <ScrollView style={{ flex: 1 }}>
                            <Image
                                style={Styles.auth.logo}
                                source={require('../../assets/images/favicon.png')}
                            />
                            <Formik
                                initialValues={{
                                    displayName: '',
                                    eMail: '',
                                    password: '',
                                    confirmPassword: ''
                                }}
                                validationSchema={scheme}
                                onSubmit={(values, helpers) => {
                                    switch (mode) {
                                        case 'login':
                                            onLoginPress(values, helpers)
                                            break
                                        case 'register':
                                            onRegisterPress(values, helpers)
                                            break;
                                        case 'password-reset':
                                            sendPasswordReset(values, helpers)
                                    }
                                }}
                            >
                                {(formikProps) => (
                                    <>
                                        {mode === 'register' ? (
                                            <FormField
                                                style={styles.formField}
                                                testInputStyle={styles.textInput}
                                                label='Full Name'
                                                formikProps={formikProps}
                                                fieldName='displayName'
                                                returnKeyType='none'
                                            />
                                        ) : <></>}
                                        <FormField
                                            style={styles.formField}
                                            testInputStyle={styles.textInput}
                                            formikProps={formikProps}
                                            fieldName='eMail'
                                            label="E-Mail"
                                            returnKeyType={mode === 'password-reset' ? 'done' : 'none'}
                                        />
                                        {mode !== 'password-reset' ?
                                            <FormField
                                                style={styles.formField}
                                                testInputStyle={styles.textInput}
                                                formikProps={formikProps}
                                                secureTextEntry={true}
                                                label='Password'
                                                fieldName='password'
                                                returnKeyType={mode !== 'register' ? 'done' : 'none'}
                                            /> : <></>}

                                        {mode === 'register' ? (
                                            <>
                                                <FormField
                                                    style={styles.formField}
                                                    testInputStyle={styles.textInput}
                                                    formikProps={formikProps}
                                                    secureTextEntry={true}
                                                    label="Confirm Password"
                                                    fieldName='confirmPassword'
                                                    returnKeyType='done'
                                                />
                                                <View style={Styles.auth.footerView}>
                                                    <Button
                                                        title="Create Account"
                                                        disabled={submitted}
                                                        onPress={formikProps.handleSubmit}
                                                    />
                                                </View>
                                                <View style={Styles.auth.footerView}>
                                                    <Text fontSize={16}>Already got an account?</Text>
                                                    <Button title="Log in" onPress={() => onGotoLoginPress(formikProps)} />
                                                </View>
                                            </>
                                        ) : <></>}
                                        {mode === 'password-reset' ? (
                                            <>
                                                <View style={Styles.auth.footerView}>
                                                    <Button
                                                        disabled={submitted}
                                                        title="Reset Password"
                                                        onPress={formikProps.handleSubmit}
                                                        style={{ marginTop: 5 }}
                                                    />
                                                    <Button
                                                        disabled={submitted}
                                                        title="Cancel"
                                                        onPress={() => onGotoLoginPress(formikProps)}
                                                        style={{ marginTop: 5 }}
                                                    />
                                                </View>
                                            </>
                                        ) : <></>}
                                        {mode === 'login' ? (
                                            <>
                                                <View style={Styles.auth.footerView}>
                                                    <Button
                                                        title="Log in"
                                                        disabled={submitted}
                                                        onPress={formikProps.handleSubmit}
                                                    />
                                                    <Button
                                                        onPress={() => googleSignIn()}
                                                        style={{ margin: 5 }}
                                                    >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <Icon color={'white'} size={24} name='logo-google' type='ionicon' />
                                                            <Text style={Styles.button.text}>oogle Sign-In</Text>
                                                        </View>
                                                    </Button>
                                                </View>
                                                <View style={{ flexDirection: 'row' }}>
                                                    <View style={Styles.auth.footerView}>
                                                        <Text fontSize={16}>Don't have an account?</Text>
                                                        <Button title="Sign up" onPress={() => onSignUpPress(formikProps)} />
                                                    </View>
                                                    <View style={Styles.auth.footerView}>
                                                        <Text fontSize={16}>
                                                            Did you forget your password?
                                                </Text>
                                                        <Button
                                                            style={styles.button}
                                                            title="Password Reset"
                                                            onPress={() => setMode('password-reset')}
                                                        />
                                                    </View>
                                                </View>
                                            </>
                                        ) : <></>}
                                    </>
                                )}
                            </Formik>
                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 10 }}>
                                <Text>{`TalkTown.live - Beta`}</Text>
                            </View>
                        </ScrollView>
                    </View>
            </Screen>
        )
    }
}

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => (
    <Authentication
        navigation={navigation}
    //  customToken={'abc.123.45657'} {/* This is not a valid custom token */}
    />
)

const styles = StyleSheet.create({
    formField: {
        marginVertical: 5,
        marginHorizontal: 15,
    },
    textInput: {
        padding: 5
    },
    button: {

    }
})