import React, { useState, useEffect, useContext } from 'react'
import { ColorValue, StyleProp, Switch, ViewStyle } from 'react-native'
import { ScreenContext } from './ScreenContext'

interface Props {
    style?: StyleProp<ViewStyle>
    value: boolean
    onChange: (value: boolean) => void
    classRef?: React.LegacyRef<Switch>
}

export default ({ style, value, onChange, classRef, ...restProps }: Props) => {
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)

    const getTrackColor = () => ({
        false: getThemedComponentStyle('Switch')[activeTheme]?.trackColorOff as ColorValue,
        true: getThemedComponentStyle('Switch')[activeTheme]?.trackColorOn as ColorValue,
    })
    const getThumbColor = () => (value
        ? getThemedComponentStyle('Switch')[activeTheme]?.thumbColorOn
        : getThemedComponentStyle('Switch')[activeTheme]?.thumbColorOff
    )

    let trackColor = getTrackColor()
    let thumbColor = getThumbColor()

    useEffect(() => {
        trackColor = getTrackColor()
        thumbColor = getThumbColor()
        console.log(`Switch: ${String(trackColor.false)}, ${String(trackColor.true)}, ${String(thumbColor)}`)
    }, [activeTheme])

    return (
        <Switch
            style={[style]}
            {...restProps}
            ref={classRef}
            trackColor={trackColor}
            thumbColor={thumbColor}
            ios_backgroundColor={getThemedComponentStyle('Switch')[activeTheme]?.iosBackgroundColor}
            onValueChange={onChange}
            value={value}
        />
    )
}
