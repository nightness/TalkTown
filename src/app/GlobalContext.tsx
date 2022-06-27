import React, { createContext, useState, useEffect, useRef } from 'react'
import * as Notifications from 'expo-notifications'
import { Camera } from 'expo-camera'
import { Audio } from 'expo-av'
import { Keyboard, Platform, useWindowDimensions, ViewStyle } from 'react-native'
import { StatusBar } from 'expo-status-bar'
// @ts-ignore
import { ModalPortal } from 'react-native-modals'


type ContextType = {
    hamburgerBadgeText?: string
    setHamburgerBadgeText?: React.Dispatch<React.SetStateAction<string | undefined>>
    sendNotificationImmediately?: (title: string, body: string) => Promise<void>
    //showToast: (options: ShowToastProps) => void
    showToast: (title: string, message: string) => void
    messages: string[]
    setMessages: React.Dispatch<React.SetStateAction<string[]>>
}

if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    })
}

const askMicrophonePermission = async () => {
    const result = await Audio.getPermissionsAsync()
    let finalStatus = result.status
    if (result.status !== "granted") {
        const { status } = await Audio.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== "granted") {
        return false
    }
    return true
}

const askCameraPermission = async () => {
    const result = await Camera.getPermissionsAsync()
    let finalStatus = result.status
    if (result.status !== "granted") {
        const { status } = await Camera.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== "granted") {
        return false
    }
    return true
}

const askPermissions = async () => {
    const result = await Notifications.getPermissionsAsync()
    let finalStatus = result.status
    if (result.status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync()
        finalStatus = status
    }
    if (finalStatus !== "granted") {
        return false
    }
    return true
}

export const GlobalContext = createContext<ContextType>({
    // Defaults
    //showToast: (options: ShowToastProps) => console.log(options), //Toast.show(options),
    showToast: (title: string, message: string) => console.log(`${message}`),
    messages: [],
    setMessages: (string) => undefined
})

interface Props {
    children: JSX.Element
}

export const GlobalProvider = ({ children }: Props) => {
    const [hamburgerBadgeText, setHamburgerBadgeText] = useState<string>()
    const [messages, setMessages] = useState<string[]>([])

    useEffect(() => {
        showToast('TalkTown', 'Welcome to TalkTown.live!');
    }, [])

    useEffect(() => {
        if (Platform.OS !== 'web') {
            askPermissions()
                .then(() => {
                    Notifications.addNotificationReceivedListener((event) => {
                        console.log(event)
                    })
                })
                .finally(() => {
                    askCameraPermission()
                        .then(() => {
                            askMicrophonePermission()
                                .then((result) => {
                                    console.log(result)
                                })
                        })
                })
        }
    }, [])

    // If finer control is needed, these can be customized more
    const showToast = (title: string, message: string) =>
        setMessages([...messages, title + '`' + message + '`' + `${Math.random()}`])

    const sendNotificationImmediately = async (title: string, body: string) => {
        if (Platform.OS === 'web') {
            return showToast(title, body)
        }
        await Notifications.presentNotificationAsync({ title, body });
    }

    return (
        <GlobalContext.Provider value={{
            hamburgerBadgeText,
            setHamburgerBadgeText,
            showToast,
            sendNotificationImmediately,
            messages,
            setMessages
        }}>
            {children}
            <ModalPortal />
        </GlobalContext.Provider>
    )
}
