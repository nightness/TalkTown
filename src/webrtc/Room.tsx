import React, { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { WebView } from '../components'
import Screen from '../components/Screen'

interface Props {
    navigation: StackNavigationProp<any, string>
}

// The HTML Source for the WebView
const html = require('./Room.html');

export default ({ navigation }: Props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [webView, setWebView] = useState<HTMLIFrameElement>()

    // Sources...
    const source = (Platform.OS === 'web') ? { html, baseUrl: '' } :
        { uri: 'https://cloud-lightning.web.app/WebRTC.html', baseUrl: '' }
    // const source = { uri: 'file:///android_asset/WebRTC.html' } // For Android, but problem... With Expo Go, it's Expo Go's asset folder
    // const source = { uri: 'https://cloud-lightning.web.app/WebRTC.html', baseUrl: 'https://cloud-lightning.web.app' }

    useEffect(() => {
        if (webView !== undefined) {
            setIsLoading(false)
            //console.log()
        }
    }, [webView])

    useEffect(() => {
        console.info(`WebView is ${isLoading ? '' : 'not'} loading`)
    }, [isLoading])

    return (
        <Screen navigation={navigation} title="Video Chat">
            <WebView
                style={{ flex: 1, backgroundColor: 'transparent' }}
                originWhitelist={['*']}
                allowsFullscreenVideo={true}
                allowsInlineMediaPlayback={true}
                bounces={false}
                mediaPlaybackRequiresUserAction={false}
                source={source}
                onError={({ nativeEvent }: any) => {
                    console.error(`WebView Error: ${nativeEvent.description}`)
                }}
                // onTouchStart={({ nativeEvent }) => {
                //     console.info(`WebView onTouchStart: ${nativeEvent.target}`)
                // }}
                onLoad={({ target }: any) => {
                    setWebView(target)
                }}
            // onNavigationStateChange={({ }) => {

            // }}
            />
        </Screen>
    )
}
