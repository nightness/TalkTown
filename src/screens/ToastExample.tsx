import React, { useEffect, useContext, useState } from 'react'
import { DefaultRouterOptions } from '@react-navigation/native'
import Screen from '../components/Screen'
import { Button } from 'react-native'
import { GlobalContext } from '../app/GlobalContext'

interface Props {
    navigation: DefaultRouterOptions
}

// Playground
export const ToastExample = ({ navigation }: Props) => {
    const { showToast } = useContext(GlobalContext)

    return (
        <Screen navigation={navigation} title="Toast Example">
            <Button
                title="Add message"
                onPress={() => {
                    showToast(`Title - ${Math.floor(Math.random() * 10000)}`, `${Date.now()}`)
                }}
            />
        </Screen>
    )
}
