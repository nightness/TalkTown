import React, { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { Screen, WebView } from '@components'
import { firebaseConfig } from '../../private/FirebaseAuth'

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
        { uri: 'https://talktown.live/WebRTC.html', baseUrl: '' }

    useEffect(() => {
        if (webView !== undefined) {
            setIsLoading(false)
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
                javaScriptEnabled={true}
                injectedJavaScript={`
                    console.log('Injected JavaScript');
                    globalThis.firebaseAuth = ${{...firebaseConfig}}
                    global.firebaseAuth = ${{...firebaseConfig}}
                `}
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
