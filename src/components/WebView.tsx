import React, { useEffect, useRef } from 'react'
import { Platform } from 'react-native'
// @ts-ignore
import { WebView as WebViewWeb } from 'react-native-web-webview'
import { WebView, WebViewProps } from 'react-native-webview'

export default React.forwardRef((props: WebViewProps, ref: any) => {
    if (Platform.OS === 'web')
        return (
            <WebViewWeb ref={ref} {...props} />
        )
    return (
        // @ts-ignore
        <WebView ref={ref} {...props} />
    )
});
