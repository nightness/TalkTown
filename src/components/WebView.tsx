import React, { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
// @ts-ignore
import { WebView as WebViewWeb } from 'react-native-web-webview'
import { WebView, WebViewProps } from 'react-native-webview'

export default (props: WebViewProps) => {
    if (Platform.OS === 'web')
        return (
            <WebViewWeb {...props} />
        )
    return (
        // @ts-ignore
        <WebView {...props} />
    )
}
