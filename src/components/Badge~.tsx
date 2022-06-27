import React from 'react'
import { Text, TouchableOpacity, ColorValue } from 'react-native'

export type FontWeightValues = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900"

interface Props {
    value?: string
    color?: ColorValue
    backgroundColor?: ColorValue
    fontSize?: number
    fontWeight?: FontWeightValues
    onPress?: () => any
}

export default ({
    value = '',
    color = 'white',
    backgroundColor = 'blue',
    fontSize,
    fontWeight = '300',
    onPress,
    ...restProps
}: Props) => {
    // TouchableHighlight is another option, this works nice though
    return (
        <TouchableOpacity
            style={{ backgroundColor, borderRadius: 10, paddingHorizontal: 20, justifyContent: 'center', alignContent: 'center'}}
            onPress={onPress}
            {...restProps}
        >
            <Text style={{ color, fontSize, fontWeight }}>{value}</Text>
        </TouchableOpacity>
    )
}
