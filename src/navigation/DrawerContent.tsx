import React, { useContext, useEffect } from 'react'
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from '@react-navigation/drawer'
import { DrawerContext } from './DrawerContext'
import DrawerContentItem from './DrawerContentItem'
import DrawerBackground from './DrawerBackground'
import { Gradient, NavigationElements, NavigationParams } from './NavigationTypes'
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native'

interface Props extends DrawerContentComponentProps {
    background?: string | Gradient
    drawerStyle?: StyleProp<ViewStyle>,
    labelStyle?: StyleProp<TextStyle>
}

export default (props: Props) => {
    const { activeClaims, badges, screens, setDrawerContent } = useContext(DrawerContext)
    const { state, navigation } = props;
    const { routeNames, routes } = state
    const navigateTo = (screenName: string) => {
        navigation.closeDrawer()
        navigation.navigate(screenName)
    }

    const elementStack: NavigationElements = []
    let currentDepth = 0

    useEffect(() => {
        setDrawerContent(navigation, state)
    })

    return (
        <DrawerBackground background={props.background}>
            <DrawerContentScrollView bounces={false} {...props}>
                {routeNames.map((routeName, routeIndex) => {
                    const currentRoute = routes.filter(value => value.name === routeName)?.[0]
                    const params = currentRoute.params as NavigationParams
                    const { label, depth, isHidden, isRestricted, claims } = screens[routeIndex]
                    if (depth > currentDepth) {
                        currentDepth++
                        elementStack.push(screens[routeIndex - 1])
                    }
                    else if (depth < currentDepth) {
                        currentDepth--
                        elementStack.pop()
                    }

                    const noopElement = <View key={`${routeName}-${Math.random()}`} />

                    // Does this route require a claim to be visible?
                    const hasClaim = (!claims || claims.filter((claim) => activeClaims?.hasOwnProperty(claim)).length > 0)
                    if (!hasClaim) return noopElement

                    // Is the parent visible?
                    const hiddenParents = elementStack.filter((item) =>
                        item.isHidden || item.isCollapsed || item.isRestricted ||
                        (item.claims?.filter(item => !activeClaims?.hasOwnProperty(item))))
                    const isVisible = (!isHidden && !isRestricted && hiddenParents.length === 0)
                    if (!isVisible) return noopElement

                    return (
                        <DrawerContentItem
                            {...props}
                            activeTintColor={params?.activeTintColor}
                            inactiveTintColor={params?.inactiveTintColor}
                            labelText={label}
                            iconGroup={params?.iconGroup}
                            iconName={params?.iconName}
                            focusedIconName={params?.focusedIconName}
                            onPress={() => navigateTo(routeName)}
                            key={`${routeName}-${Math.random()}`}
                            badgeText={badges[routeName] as string}
                            iconStyle={{ marginLeft: (15 * depth) }}
                        />
                    )
                })}
            </DrawerContentScrollView>
        </DrawerBackground>
    )
}