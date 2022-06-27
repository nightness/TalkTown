import { StackNavigationProp } from '@react-navigation/stack'
import React, { useState, useEffect, useContext } from 'react'
import { Linking, Platform, View } from 'react-native'
import Screen from '../components/Screen'
import {
    Button,
    Text,
    ActivityIndicator,
    Image
} from '../components'

import { ProfileContext } from '../app/ProfileContext'
import { Styles } from '../app/Styles'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const [name, setName] = useState<string>()
    const profileCache = useContext(ProfileContext)
    const expoURL = 'exp://exp.host/@nightness/cloud-lightning-messenger'
    const [baseOperatingSystem, setBaseOperatingSystem] = useState<string>('unknown')

    useEffect(() => {
        /*  This is used by the web version of the app to either display
            a QR code or a button to launch Expo Go */
        if (Platform.OS === 'web') {
            // Loading this module is crashing the native apps so it being loaded dynamically
            const devInfo = require('react-native-device-info')
            devInfo.getBaseOs()
                .then((os: string) => setBaseOperatingSystem(os))
                .catch(() => undefined)
        }
    }, [])

    // useEffect(() => {
    //     setHamburgerBadgeText?.('I love programming')
    // }, [])

    // useEffect(() => {
    //     console.log(`ScreenOrientation: ${screenOrientation}`)
    // }, [screenOrientation])

    useEffect(() => {
        if (!profileCache) return
        const username = profileCache.getUserName()
        if (username) {
            setName(username)
        }
    }, [profileCache.cachedUsers])

    const username = profileCache.getUserName()

    return (
        <Screen navigation={navigation} title="Home">
            { profileCache.isFetching ? <ActivityIndicator /> :
                <View style={{ margin: 3 }}>
                    <Text>{`Welcome${username ? ' ' + username : ''}!`}</Text>
                </View>
            }
        </Screen>
    )
}
