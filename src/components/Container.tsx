import React, { useContext, useRef } from 'react'
import { View, StyleProp, ViewStyle, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { ScreenContext } from './ScreenContext'


export type Gradient = [string, string, ...string[]]

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
    background?: string | Gradient
}

export default ({ children, background, style }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)
    const globalTheme = getThemedComponentStyle('Container')

    if (background && Array.isArray(background))
        return (
            <View style={{ flex: 1 }}>
                <LinearGradient style={{ flex: 1 }} colors={background}>
                    {children}
                </LinearGradient>
            </View>
        )

    if (background)
        return (
            <View style={{ flex: 1, backgroundColor: background }}>
                <View style={[localStyles.view, { backgroundColor: background }, style]}>
                    {children}
                </View>
            </View>
        )

    if (globalTheme[activeTheme].backgroundColor)
        return (
            <View style={{ flex: 1, backgroundColor: globalTheme[activeTheme]?.backgroundColor }}>
                <View style={[localStyles.view, globalTheme[activeTheme], style]}>
                    {children}
                </View>
            </View>

        )
    return (
        <View style={[localStyles.view, globalTheme[activeTheme], style]}>
            {children}
        </View>
    )
}

const localStyles = StyleSheet.create({
    view: {
        flex: 1,
        margin: 0,
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        width: '100%'
    },
})