import React, { useEffect, useContext, useState } from 'react'
import { View } from 'react-native'
import { DefaultRouterOptions } from '@react-navigation/native'
import Screen from '../components/Screen'
import Picker from '../components/Picker'
import {
    Button,
    TextInput,
} from '../components'
import { FirebaseContext } from '../database/FirebaseContext'

interface Props {
    navigation: DefaultRouterOptions
}

// Playground
export const Playground = ({ navigation }: Props) => {
    const { currentUser, claims, addClaim, removeClaim } = useContext(FirebaseContext)
    const [claimName, setClaimName] = useState()
    const [data, setData] = useState([])

    useEffect(() => {
        setTimeout(() => {
            setData([
                { label: 'First', value: 1 },
                { label: 'Second', value: 2 },
                { label: 'Third', value: 3 },
            ])
        }, 1000)
    }, [])

    useEffect(() => {
        if (!currentUser) return
        //console.log(currentUser)
    }, [currentUser])

    return (
        <Screen navigation={navigation} title="Playground">
            <View>
                <Picker
                    data={data}
                    onValueChanged={(value) => {
                        console.log(value)
                    }}
                />
                <TextInput
                    onChangeText={(text) => setClaimName(text)}
                    placeHolder={'claim'}
                />
                <Button
                    title="Add Claim"
                    onPress={async () => {
                        await addClaim(claimName)
                        await currentUser.reload() // Since I'm working with my own claims
                    }}
                />
                <Button
                    title="Remove Claim"
                    onPress={async () => {
                        await removeClaim(claimName)
                        await currentUser.reload() // Since I'm working with my own claims
                    }}
                />
                <Button title="Console Log Claims" onPress={() => console.log(claims)} />
                <Button
                    title="Reload Current User"
                    onPress={async () => {
                        await currentUser.reload()
                    }}
                />
            </View>
        </Screen>
    )
}
