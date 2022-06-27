import React, { useContext } from 'react'
import { TextInput, TextInputProps, Keyboard, StyleSheet } from 'react-native'
import { ScreenContext } from './ScreenContext'
import { Styles } from '../app/Styles'
interface Props extends TextInputProps {
    classRef?: React.LegacyRef<TextInput>
}

export default ({
    returnKeyType = 'none',
    autoCompleteType = 'off',
    autoCapitalize = 'none',
    autoCorrect = false,
    spellCheck = false,
    underlineColorAndroid = 'transparent',
    //selectionColor = '',
    style,
    classRef,
    keyboardAppearance,
    ...restProps
}: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)
    const appearance = (activeTheme !== 'Dark') ? 'light' : 'dark'

    return (
        <TextInput
            enablesReturnKeyAutomatically={true}
            returnKeyType={returnKeyType}
            autoCompleteType={autoCompleteType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            underlineColorAndroid={underlineColorAndroid}
            keyboardAppearance={appearance}
            ref={classRef}
            style={[Styles.textInput.input, getThemedComponentStyle('TextInput')[activeTheme], style]}
            placeholderTextColor={getThemedComponentStyle('TextInput')[activeTheme]?.color}
            onSubmitEditing={Keyboard.dismiss}
            {...restProps}
        />
    )
}
