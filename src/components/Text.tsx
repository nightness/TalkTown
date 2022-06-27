import React, { useContext, useRef, useEffect } from 'react'
import { Text, View, StyleSheet, StyleProp, TextStyle, ColorValue, TextProps } from 'react-native'
import { ScreenContext } from './ScreenContext'

interface Props extends TextProps {
    children: JSX.Element | JSX.Element[] | string
    style?: StyleProp<TextStyle> | object
    classRef?: React.LegacyRef<Text>
    fontWeight?: string
    fontSize?: number
    color?: ColorValue
}

export default ({
    children,
    style,
    classRef,
    fontWeight = '300',
    fontSize = 16,
    color,
    ...restProps
}: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)

    return (
        <Text
            {...restProps}
            ref={classRef}
            style={[
                getThemedComponentStyle('Text')[activeTheme],
                {
                    fontWeight, // String
                    fontSize, // Integer
                },
                style,
            ]}
            selectable={false}
        >
            {children}
        </Text>
    )
}
