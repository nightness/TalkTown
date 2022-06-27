import React, { useContext } from 'react'
// @ts-ignore
import Modal, { ModalContent } from 'react-native-modals'
import { ScreenContext } from './ScreenContext'
import { StyleProp, ViewStyle, StyleSheet } from 'react-native'

interface Props {
    children: JSX.Element | JSX.Element[]
    style?: StyleProp<ViewStyle>
    visible: boolean
    onTouchOutside?: () => void
}

export default ({
    children,
    style,
    onTouchOutside,
    visible = false,
    ...restProps
}: Props) => {
    const { getThemedComponentStyle, activeTheme } = useContext(ScreenContext)

    return (
        <Modal visible={visible} onTouchOutside={onTouchOutside} {...restProps}>
            <ModalContent style={[localStyles.content, getThemedComponentStyle('Modal')[activeTheme], style]}>
                {children}
            </ModalContent>
        </Modal>
    )
}

const localStyles = StyleSheet.create({
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
    },
})
