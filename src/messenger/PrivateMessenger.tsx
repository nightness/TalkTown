import React, { useState, useContext, useEffect, useRef } from 'react'
import { View } from 'react-native'
import {
    Container,
    TextInput,
    Button,
    ScreenContext
} from '../components'
import Screen from '../components/Screen'
import Picker, { PickerItem } from '../components/Picker'
import FirestoreCollectionView from '../database/firebase/FirestoreCollectionView'
import { Styles } from '../app/Styles'
import { DocumentData, QuerySnapshot, useCollection, callFirebaseFunction, FirebaseContext } from '@database/firebase'
import Message from './Message'
import {
    NativeSyntheticEvent,
    TextInputKeyPressEventData,
    TextInput as NativeTextInput
} from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { LinearGradient } from 'expo-linear-gradient'
import { GradientColors } from '../app/GradientColors'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const { currentUser, claims } = useContext(FirebaseContext)
    const { activeTheme } = useContext(ScreenContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('/profiles')
    const [members, setMembers] = useState<PickerItem[]>([])
    const [selectedMember, setSelectedMember] = useState<PickerItem>()
    const [messageText, setMessageText] = useState<string>('')
    const [messageCollectionPath, setMessageCollectionPath] = useState<string>('/public')
    const textInput = useRef<NativeTextInput>()

    useEffect(() => {
        textInput.current?.focus()
    }, [textInput])

    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        var newState: PickerItem[] = []
        const querySnapshot = snapshot as QuerySnapshot<DocumentData>
        querySnapshot.docs.forEach((docRef) => {
            const push = async (docRef: DocumentData) => {
                if (docRef.id === currentUser?.uid) return
                const name = await docRef.get('displayName')
                newState.push({
                    label: name || `{${docRef.id}}`,
                    value: docRef.id,
                })
            }
            push(docRef)
                .then(() => setMembers(newState))
                .catch((err) => console.error(err))
        })
    }, [snapshot])

    useEffect(() => {
        if (currentUser && selectedMember && selectedMember.value)
            setMessageCollectionPath(`/messages/${currentUser.uid}/${selectedMember.value}/`)
        console.log(selectedMember)
    }, [selectedMember])

    useEffect(() => {
        console.log(claims)
    }, [claims])

    const sendMessage = () => {
        if (!selectedMember || !currentUser) return
        const text = messageText
        setMessageText('')
        callFirebaseFunction('setMessage', {
            collectionPath: `/messages/${currentUser.uid}/${selectedMember.value}`,
            duplicationPath: `/messages/${selectedMember.value}/${currentUser.uid}`,
            message: text,
        }).then((results) => {
            const data = results.data
            if (typeof data.type === 'string') {
                console.error(data.message)
                if (data.type === 'silent') return
                alert(data.message)
            } else {
                console.log(data)
            }
            textInput.current?.focus()
        }).catch((error: any) => {
            console.error(error)
        })
    }

    const onMessageKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key != 'Enter') return
        // Adds a new message to the chatroom
        sendMessage()
    }

    return (
        <Screen navigation={navigation} title={'Private Messages'}>
            <Container>
                <LinearGradient
                    colors={GradientColors[activeTheme].secondary}>
                    <View style={Styles.messenger.views}>
                        <Picker
                            data={members}
                            onValueChanged={setSelectedMember}
                        />
                    </View>
                </LinearGradient>
                <FirestoreCollectionView<Message>
                    collectionPath={messageCollectionPath}
                    autoScrollToEnd={true}
                    orderBy="postedAt"
                    limitLength={25}
                    // @ts-ignore
                    renderItem={({ item }) => <Message item={item} />}
                />
                <LinearGradient
                    colors={GradientColors[activeTheme].secondary}>
                    <View style={Styles.messenger.views}>
                        <TextInput
                            value={messageText}
                            style={Styles.messenger.textInput}
                            onChangeText={(msg: string) => setMessageText(msg)}
                            onKeyPress={onMessageKeyPress}
                            classRef={textInput as React.LegacyRef<NativeTextInput>}
                        />
                        <Button
                            title="Send"
                            style={Styles.messenger.sendButton}
                            disabled={messageText.length < 1}
                            onPress={sendMessage}
                        />
                    </View>
                </LinearGradient>
            </Container>
        </Screen>
    )
}
