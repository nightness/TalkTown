import { ComponentType } from 'react'
import { IconFamilies } from '../components/Icon'

export type Notifications = {
    groups: { [routeName: string] : {} }
}

export type Badges = { [routeName: string] : {} }

export type Gradient = [string, string, ...string[]]

export interface NavigationParams {
    activeTintColor?: string,
    inactiveTintColor?: string,
    iconGroup?: IconFamilies,
    iconName?: string,
    focusedIconName?: string,
}

/*
    name was broken up into label (displayed) and routeName (the
    actual name value), only routeName needs to be unique
*/ 
export interface NavigationElement {
    label: string,
    routeName: string,
    component: ComponentType<any>,
    initialParams: NavigationParams,
    depth: number,
    claims?: string[],
    isHidden?: boolean,
    isCollapsed?: boolean
    isRestricted?: boolean
}

export type NavigationElements = NavigationElement[]

