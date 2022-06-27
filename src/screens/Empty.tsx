import React from 'react'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import Screen from '../components/Screen'

interface Props {
    navigation: DrawerNavigationProp<any>
}

export default ({ navigation }: Props) => {
    return (
        <Screen navigation={navigation} title="">

        </Screen>
    )
}
