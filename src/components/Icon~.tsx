import React from 'react'
import { Text, ColorValue, TextStyle, StyleProp } from 'react-native'
import {
    AntDesign, Entypo, Feather, Ionicons, FontAwesome, FontAwesome5, EvilIcons, Fontisto,
    Foundation, MaterialIcons, MaterialCommunityIcons, Octicons, SimpleLineIcons, Zocial
} from '@expo/vector-icons';

export type IconFamilies = 'antdesign' | 'entypo' | 'evilicon' | 'feather' |
    'font-awesome' | 'font-awesome-5' | 'fontisto' | 'foundation' | 'ionicon' |
    'material' | 'material-community' | 'octicon' | 'simple-line-icon' | 'zocial'

interface Props {
    style?: StyleProp<TextStyle>
    color?: ColorValue
    size?: number
    name: string
    type: IconFamilies
    onPress?: () => any
}

export default ({
    color = 'black',
    size = 26,
    type,
    ...restProps
}: Props) => {
    switch (type) {
        case 'antdesign': {
            //@ts-ignore
            return <AntDesign color={color} size={size} {...restProps} />
        }
        case 'entypo': {
            //@ts-ignore
            return <Entypo color={color} size={size} {...restProps} />
        }
        case 'evilicon': {
            //@ts-ignore
            return <EvilIcons color={color} size={size} {...restProps} />
        }
        case 'feather': {
            //@ts-ignore
            return <Feather color={color} size={size} {...restProps} />
        }
        case 'font-awesome': {
            //@ts-ignore
            return <FontAwesome color={color} size={size} {...restProps} />
        }
        case 'font-awesome-5': {
            //@ts-ignore
            return <FontAwesome5 color={color} size={size} {...restProps} />
        }
        case 'fontisto': {
            //@ts-ignore
            return <Fontisto color={color} size={size} {...restProps} />
        }
        case 'foundation': {
            //@ts-ignore
            return <Foundation color={color} size={size} {...restProps} />
        }
        case 'ionicon': {
            //@ts-ignore
            return <Ionicons color={color} size={size} {...restProps} />
        }
        case 'material': {
            //@ts-ignore
            return <MaterialIcons color={color} size={size} {...restProps} />
        }
        case 'material-community': {
            //@ts-ignore
            return <MaterialCommunityIcons color={color} size={size} {...restProps} />
        }
        case 'octicon': {
            //@ts-ignore
            return <Octicons color={color} size={size} {...restProps} />
        }
        case 'simple-line-icon': {
            //@ts-ignore
            return <SimpleLineIcons color={color} size={size} {...restProps} />
        }
        case 'zocial': {
            //@ts-ignore
            return <Zocial color={color} size={size} {...restProps} />
        }
        default: {
            return <Text style={{ color, fontWeight: '900', fontSize: size }}>{'?'}</Text>
        }
    }
}
