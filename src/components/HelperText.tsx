import React, { useContext, useRef, useEffect } from 'react'
import { StyleProp, TextStyle } from 'react-native'
import { ScreenContext } from './ScreenContext'
import Text from './Text'


interface Props {
    children: JSX.Element
    type: 'error' | 'info'
    style?: StyleProp<TextStyle> | object
    fontWeight?: string
    fontSize?: number
}

export default ({ children, style, fontWeight = '200', fontSize = 14, type, ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)
    return (
        <Text
            {...restProps}
            style={[
                getThemedComponentStyle('HelperText')[activeTheme],
                style,
                {
                    fontWeight, // String
                    fontSize, // Integer
                },
            ]}
            selectable={false}
        >
            {children}
        </Text>
    )
}
