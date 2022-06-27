import React from 'react'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'
import TextInput from './TextInput'
import HelperText from './HelperText'
import { ReturnKeyTypeOptions } from 'react-native'

interface Props {
    formikProps: any
    fieldName: string
    label?: string
    placeholder?: string
    returnKeyType?: ReturnKeyTypeOptions
    secureTextEntry?: boolean
    style?: StyleProp<ViewStyle>
    testInputStyle?: StyleProp<TextStyle>
}

export default ({
    formikProps,
    fieldName,
    label,
    returnKeyType,
    secureTextEntry = false,
    style,
    testInputStyle,
    ...restProps
}: Props) => {

    return (
        <View style={style}>
            <TextInput
                style={testInputStyle}
                placeholder={label}
                returnKeyType={returnKeyType}
                onChangeText={formikProps.handleChange(fieldName)}
                onKeyPress={(event) => {
                    if (event.nativeEvent.key === 'Enter') {
                        if (returnKeyType === 'done')
                            formikProps.handleSubmit()
                        formikProps.preventDefault = true
                        formikProps.stopPropagation = true
                    }
                }}
                secureTextEntry={secureTextEntry}
                value={formikProps.values[fieldName]}
                onBlur={formikProps.handleBlur(fieldName)}
                {...restProps}
            />
            <HelperText fontSize={10} type="error">
                {formikProps.touched[fieldName] && formikProps.errors[fieldName]}
            </HelperText>
        </View>
    )
}