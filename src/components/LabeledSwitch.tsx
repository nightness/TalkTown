import React, { StyleHTMLAttributes } from 'react'
import { View } from 'react-native'
import Switch from './Switch'
import Text from './Text'
import { ActivityIndicator, StyleProp, TextStyle, ViewStyle, StyleSheet } from 'react-native'

interface Props {
    label: string
    style?: StyleProp<ViewStyle>
    loadingIndicatorStyle?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    value: boolean
    isLoading: boolean
    onChange: (value: boolean) => void
}

export default ({
    label,
    style,
    textStyle,
    loadingIndicatorStyle,
    isLoading,
    value,
    ...restProps
}: Props) => {
    return (
        <View style={[localStyles.view, style]}>
            {label ? (
                <Text style={[{ marginRight: 10 }, textStyle]}>{label}</Text>
            ) : (
                <></>
            )}
            {isLoading ? (
                <ActivityIndicator style={loadingIndicatorStyle} />
            ) : (
                <Switch value={value} {...restProps} />
            )}
        </View>
    )
}

const localStyles = StyleSheet.create({
    view: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
    }
})