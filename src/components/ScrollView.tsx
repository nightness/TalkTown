import React, { useContext } from 'react'
import { ScreenContext } from './ScreenContext'
import { ScrollView, StyleProp, ViewStyle, StyleSheet } from 'react-native'

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
    bounces?: boolean
    keyboardShouldPersistTaps?: boolean | "always" | "never" | "handled"

}

export default ({ children, style, bounces, keyboardShouldPersistTaps, ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)

    return (
        <ScrollView
            style={[localStyles.scrollView, getThemedComponentStyle('ScrollView')[activeTheme], style]}
            bounces={bounces}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            {...restProps}
        >
            {children}
        </ScrollView>
    )
}

const localStyles = StyleSheet.create({
    scrollView: {
        borderRadius: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignContent: 'center'
    },
})
