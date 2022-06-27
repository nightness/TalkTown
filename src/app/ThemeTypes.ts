export type Theme = 'Light' | 'Dark'

export type ThemeStyles = {
    activeBackgroundColor?: string
    activeTintColor?: string
    backgroundColor?: string
    borderColor?: string
    borderLeftColor?: string
    borderBottomColor?: string
    borderTopColor?: string
    borderRightColor?: string
    color?: string
    inactiveBackgroundColor?: string
    inactiveTintColor?: string
    iosBackgroundColor?: string
    thumbColorOn?: string
    thumbColorOff?: string
    trackColorOn?: string
    trackColorOff?: string
}

export interface ThemeType {
    Light: ThemeStyles
    Dark: ThemeStyles
}

export type NamedTheme = [string, ThemeType]

export type Themes = NamedTheme[]