import React, { useState, useContext, useEffect } from 'react'
import { View } from 'react-native'
import { Header } from 'react-native-elements'
import { Image, Text, Icon, ScreenContext, Badge } from '.'
import { LogoutModal } from '../modals/LogoutModal'
import { StackNavigationProp } from '@react-navigation/stack'
import { useAuthState } from '../database/firebase'

interface Props {
    navigation: StackNavigationProp<any>
    title: string
    hamburgerBadgeText?: string
    photoURL?: string | null
    hasDrawerNavigation?: boolean
    hasHome?: boolean
    hasBack?: boolean
}

export default ({
    navigation,
    title,
    photoURL,
    hamburgerBadgeText,
    hasDrawerNavigation = true,
    hasHome = false,
    hasBack = false,
}: Props) => {
    const [currentUser, loadingUser, errorUser] = useAuthState()
    const { activeTheme, setActiveTheme, getThemedComponentStyle } = useContext(ScreenContext)
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [showLogout, setShowLogout] = useState(currentUser ? true : false)

    useEffect(() => {
        setShowLogout(currentUser ? true : false)
    }, [currentUser])

    const toggleDarkMode = () => {
        setActiveTheme(activeTheme === 'Dark' ? 'Light' : 'Dark')
    }

    const iconSize = 38

    const centerComponent = (
        <Text style={{ textAlignVertical: 'center' }} fontWeight="700" fontSize={26}>
            {title}
        </Text>
    )
    const leftComponent = (
        <View style={{ flexDirection: 'row' }}>
            {hasDrawerNavigation ? (
                <>
                    <Icon
                        type='material'
                        name='menu'
                        size={iconSize}
                        // @ts-ignore
                        onPress={navigation.openDrawer}
                    />
                    { hamburgerBadgeText ?
                        <Badge style={{ marginLeft: -15 }} value={hamburgerBadgeText} />
                        : <></>
                    }
                </>
            ) : (
                <></>
            )}
            {hasHome ? (
                <Icon
                    type='material'
                    name='home'
                    size={iconSize}
                    onPress={() => navigation.popToTop()}
                />
            ) : (
                <></>
            )}
            {hasBack ? (
                <Icon
                    type='material'
                    name='navigate-before'
                    size={iconSize}
                    onPress={() => navigation.pop()}
                />
            ) : (
                <></>
            )}
        </View>
    )

    const rightComponent = (
        <View style={{ flexDirection: 'row' }}>
            <Icon
                type='material'
                name='settings-brightness'
                size={iconSize}
                onPress={toggleDarkMode}
            />
            {showLogout ? (
                photoURL ? (
                    <Image
                        source={{ uri: photoURL }}
                        style={{ width: iconSize, height: iconSize, borderRadius: (iconSize / 2) }}
                        onPress={() => setShowLogoutModal(true)}                        
                    />
                ) : (
                    <Icon
                        type='material'
                        name='face'
                        size={iconSize}
                        onPress={() => setShowLogoutModal(true)}
                    />
                )
            ) : (
                <></>
            )}
        </View>
    )

    return (
        <>
            <LogoutModal
                shown={showLogoutModal}
                navigation={navigation}
                dismiss={() => setShowLogoutModal(false)}
            />
            <Header
                containerStyle={{
                    width: '100%',
                    borderBottomColor: getThemedComponentStyle('ScreenHeader')[activeTheme]?.borderBottomColor,
                }}
                backgroundColor="none"
                //backgroundImageStyle={{}}
                centerComponent={centerComponent}
                leftComponent={leftComponent}
                //leftContainerStyle={{}}
                placement="center"
                rightComponent={rightComponent}
                //rightContainerStyle={{}}
                //statusBarProps={{}}
            />
        </>
    )
}
