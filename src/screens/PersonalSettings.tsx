import React, { useContext } from 'react'
import { ReturnKeyTypeOptions, View, StyleSheet } from 'react-native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { Screen, FormField, Text, Button } from '../components'
import { Formik, FormikProps } from 'formik'
import { FirebaseContext } from '../database/firebase/FirebaseContext'
import * as Yup from 'yup'
import { getAuth } from '../database/firebase'

interface SettingProp {
    label: string,
    fieldName: string,
    formikProps: FormikProps<any>
    returnKeyType?: ReturnKeyTypeOptions
}

const Setting = ({ label, fieldName, formikProps, returnKeyType = 'none' }: SettingProp) => {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10 }}>
            <Text fontWeight='500' style={{ flex: 1 }}>{label}</Text>
            <FormField
                style={[styles.formField, { flex: 3 }]}
                testInputStyle={styles.textInput}
                label={label}
                formikProps={formikProps}
                fieldName={fieldName}
                returnKeyType={returnKeyType}
            />
        </View>
    )

}

interface Props {
    navigation: DrawerNavigationProp<any>
}

const scheme = Yup.object({
    displayName: Yup.string()
        .required('Display name is a required field')
        .min(3),
    photoURL: Yup.string()
        .url('Please specify a valid URL')
})

export default ({ navigation }: Props) => {
    const { currentUser, setProfile } = useContext(FirebaseContext)

    return (
        <Screen navigation={navigation} title='Personal Settings'>
            <View style={{ flex: 1 }}>
                <Formik
                    initialValues={{
                        displayName: currentUser?.displayName,
                        photoURL: currentUser?.photoURL ? currentUser.photoURL : ''
                    }}
                    validationSchema={scheme}
                    onSubmit={(values, helpers) => {
                        setProfile({
                            photoURL: values.photoURL
                        })
                    }}
                    validateOnChange={true}
                >
                    {(formikProps) => (<>
                        <Setting
                            formikProps={formikProps}
                            label='Display Name'
                            fieldName='displayName'
                        />
                        <Setting
                            formikProps={formikProps}
                            label='Photo URL'
                            fieldName='photoURL'
                        />
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Button
                                title='Save Changes'
                                disabled={!formikProps.isValid}
                                onPress={formikProps.handleSubmit}
                            />
                        </View>
                        {!currentUser?.emailVerified ?
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 10, marginTop: 20 }}>
                                <View style={{ flex: 3, flexDirection: 'column', alignItems: 'center', marginHorizontal: 10 }}>
                                    <Text fontWeight='500'>Your E-Mail address has not been verified</Text>
                                    <Button
                                        style={{ marginLeft: 20 }}
                                        title='Send Verification E-Mail'
                                        onPress={() => {
                                            if (!currentUser?.email) return
                                            currentUser?.sendEmailVerification()
                                        }}
                                    />
                                </View>
                            </View> : <></>
                        }
                    </>)}
                </Formik>
            </View>
        </Screen>
    )
}

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