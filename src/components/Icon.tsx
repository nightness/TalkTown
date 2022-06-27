import React, { useContext } from 'react'
import { Text, ColorValue, TextStyle, StyleProp, GestureResponderEvent } from 'react-native'
import {
    AntDesign, Entypo, Feather, Ionicons, FontAwesome, FontAwesome5, EvilIcons, Fontisto,
    Foundation, MaterialIcons, MaterialCommunityIcons, Octicons, SimpleLineIcons, Zocial
} from '@expo/vector-icons';
import { ScreenContext } from './ScreenContext';

export type IconFamilies = 'antdesign' | 'entypo' | 'evilicon' | 'feather' |
    'font-awesome' | 'font-awesome-5' | 'fontisto' | 'foundation' | 'ionicon' |
    'material' | 'material-community' | 'octicon' | 'simple-line-icon' | 'zocial'

interface Props {
    colors?: [ColorValue, ColorValue] // [0] === Light Mode, [1] === Dark Mode
    size?: number
    type: IconFamilies
    name: string
    style?: StyleProp<TextStyle>
    onPress?: ((event: GestureResponderEvent) => void)
    color?: ColorValue
}

export default ({
    colors,
    size = 26,
    type,
    ...restProps
}: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)
    const themeStyle = getThemedComponentStyle('Icon')[activeTheme]
    const color = restProps.color ? restProps.color :
        colors ? colors[activeTheme === 'Light' ? 0 : 1] : themeStyle.color

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
