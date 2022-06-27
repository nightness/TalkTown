import React from 'react'
import { View } from 'react-native'
import Text from './Text'
import TextInput from './TextInput'

interface Props {
    titleTop?: string
    titleLeft?: string
    titleRight?: string
    titleBottom?: string
    textStyle?: any
    textInputStyle?: any
}

export default ({
    titleTop,
    titleLeft,
    titleRight,
    titleBottom,
    textStyle,
    textInputStyle,
    ...restProps // Passed to TextInput
}: Props) => {
    return (
        <View>
            {titleTop ? <Text style={textStyle}>{titleTop}</Text> : <></>}
            <View style={{ flexDirection: 'row' }}>
                {titleLeft ? <Text style={textStyle}>{titleLeft}</Text> : <></>}
                <TextInput {...restProps} style={textInputStyle} />
                {titleRight ? <Text style={textStyle}>{titleRight}</Text> : <></>}
            </View>
            {titleBottom ? <Text style={textStyle}>{titleBottom}</Text> : <></>}
        </View>
    )
}
