import React from 'react'
import {
    TouchableOpacity,
    Image,
    GestureResponderEvent,
    ImageSourcePropType,
    StyleProp,
    ImageStyle,
} from 'react-native'

interface Props {
    disabled?: boolean
    style?: StyleProp<ImageStyle> | object
    source: ImageSourcePropType
    onPress?: (event: GestureResponderEvent) => void
}

export default ({ disabled, onPress, source, style, ...restProps }: Props) => {
    return (
        <TouchableOpacity disabled={disabled} onPress={onPress}>
            <Image style={style} source={source} {...restProps} />
        </TouchableOpacity>
    )
}
