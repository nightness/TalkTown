import React from 'react'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Gradient } from './NavigationTypes'

interface BackgroundProps {
    children: JSX.Element | JSX.Element[]
    background?: string | Gradient
}

export default ({ children, background }: BackgroundProps) => {
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
                {children}
            </View>
        )
    return (
        <View style={{ flex: 1 }}>
            {children}
        </View>
    )
}