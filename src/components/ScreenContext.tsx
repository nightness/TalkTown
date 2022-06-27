import * as ScreenOrientation from 'expo-screen-orientation'
import { StatusBar, StatusBarStyle } from 'expo-status-bar'
import React, { createContext, useEffect, useState } from 'react'
import { Dimensions, Keyboard, Platform, ScaledSize, useWindowDimensions } from 'react-native'
// @ts-ignore
import { ModalPortal } from 'react-native-modals'
import { Theme, Themes, ThemeType } from '../app/ThemeTypes'

type Orientation = ScreenOrientation.Orientation
type ResizingType = { window: ScaledSize; screen: ScaledSize };

export interface Size {
    width: number
    height: number
}

type ContextType = {
    activeTheme: Theme
    setActiveTheme: (theme: Theme) => void
    themes?: any[]
    styles?: any[]
    screenOrientation: ScreenOrientation.Orientation
    isKeyboardOpen: boolean
    keyboardHeight: number
    windowSize?: Size
    getThemedComponentStyle: (componentName: string, isDisabled?: boolean, hasFocus?: boolean) => ThemeType
}

export const ScreenContext = createContext<ContextType>({
    activeTheme: 'Light',
    setActiveTheme: (theme: Theme) => undefined,
    isKeyboardOpen: false,
    keyboardHeight: 0,
    screenOrientation: ScreenOrientation.Orientation.UNKNOWN,
    getThemedComponentStyle: (componentName: string, isDisabled?: boolean, hasFocus?: boolean) => ({
        Light: {},
        Dark: {}
    }),
    windowSize: { width: 0, height: 0 }
})

interface Props {
    children: JSX.Element
    themes: Themes
}

export const ScreenProvider = ({ themes, children }: Props) => {
    const { width, height } = useWindowDimensions()
    const [activeTheme, setActiveTheme] = useState<Theme>('Light')
    const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false)
    const [
        screenOrientation,
        setScreenOrientation,
    ] = useState<ScreenOrientation.Orientation>(ScreenOrientation.Orientation.UNKNOWN)

	const [windowSize, setWindowSize] = useState<ScaledSize>();

	useEffect(() => {
		setWindowSize(Dimensions.get('window'));

		// Handles window resizing
		const handleResize = ({ window, screen }: ResizingType) => {
			setWindowSize(window);
		};

		// Add listener for window size changes
		Dimensions.addEventListener('change', handleResize);
		return () => {
			// Remove listener on unmount
			Dimensions.removeEventListener('change', handleResize);
		};
	}, []);


    const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
    useEffect(() => {
        if (Platform.OS === 'web') return

        const didShow = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
        const didHide = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

        // cleanup function
        return () => {
            didShow.remove();
            didHide.remove();
        }
    }, [])

    const keyboardDidShow = (frames: any) => {
        setIsKeyboardOpen(true)
        setKeyboardHeight(frames.endCoordinates.height)
    }

    const keyboardDidHide = () => {
        setIsKeyboardOpen(false)
        setKeyboardHeight(0)
    }

    // Screen orientation state handling
    useEffect(() => {
        if (Platform.OS === 'web') return

        ScreenOrientation.unlockAsync().catch((err: Error) => console.warn(err))
        ScreenOrientation.getOrientationAsync()
            .then((value: Orientation) => {
                setScreenOrientation(value)
            })
            .catch((err: Error) => console.warn(err))

        ScreenOrientation.addOrientationChangeListener((value) =>
            setScreenOrientation(value.orientationInfo.orientation)
        )

        return ScreenOrientation.removeOrientationChangeListeners
    })

    const getThemedComponentStyle = (componentName: string, isDisabled?: boolean, hasFocus?: boolean) => {
        if (isDisabled)
            componentName += 'Disabled'
        for (let i = 0; i < themes.length; i++) {
            const theme = themes[i]
            if (theme[0] === componentName)
                return theme[1]
        }
        // console.info(`No theme provided for '${componentName}' components... Default theme used.`)
        return ({
            Light: { background: 'white', color: 'black' },
            Dark: { background: 'black', color: 'white' }
        })
    }

    const getStatusBarStyle = () => {
        if (activeTheme === 'Dark')
            return ('light' as StatusBarStyle)
        return ('dark' as StatusBarStyle)
    }

    return (
        <ScreenContext.Provider value={{
            activeTheme,
            setActiveTheme,
            getThemedComponentStyle,
            screenOrientation,
            isKeyboardOpen, keyboardHeight,
            windowSize,
        }}>
            {children}
            <StatusBar style={getStatusBarStyle()} />
        </ScreenContext.Provider>
    )
}

