import { Styles } from '@app'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useContext } from 'react'
import { ActivityIndicator, ActivityIndicatorProps, StyleProp, View, ViewStyle } from 'react-native'
import { GradientColors } from '../app/GradientColors'
import { ScreenContext } from './ScreenContext'

interface Props extends ActivityIndicatorProps {
    viewStyle?: StyleProp<ViewStyle>
    fullscreen?: boolean
}

export default ({ fullscreen, viewStyle = Styles.views.activityIndicator, size = 'large', ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)
    const background = GradientColors[activeTheme].background

    if (fullscreen && background)
        return (
            <LinearGradient style={{ flex: 1, justifyContent: 'center' }} colors={background}>
                <ActivityIndicator size={size} {...restProps} />
            </LinearGradient>
        )

    return (
        <View style={[
            getThemedComponentStyle('ActivityIndicator')[activeTheme],
            viewStyle
        ]}>
            <ActivityIndicator size={size} {...restProps} />
        </View>
    )
}
