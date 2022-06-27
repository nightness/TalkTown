import React, { useState, useContext, useEffect } from 'react'
import { View } from 'react-native'
import {
    Container,
    ActivityIndicator,
    DisplayError,
    LabeledSwitch,
} from '../components'
import Screen from '../components/Screen'
import Picker, { PickerItem } from '../components/Picker'
import { Styles } from '../app/Styles'
import { Claims } from '../database/firebase/DataTypes'
import { FirebaseContext } from '../database/firebase/FirebaseContext'
import { DocumentData, QuerySnapshot, useCollection } from '../database/firebase'
import { StackNavigationProp } from '@react-navigation/stack'

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation, ...restProps }: Props) => {
    const { claims, addClaim, removeClaim, getClaims } = useContext(FirebaseContext)
    const [snapshot, loadingCollection, errorCollection] = useCollection('profiles')
    const [members, setMembers] = useState<PickerItem[]>([])
    const [selectedMember, setSelectedMember] = useState<PickerItem>()
    const [loadingClaims, setLoadingClaims] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isManager, setIsManager] = useState(false)
    const [isModerator, setIsModerator] = useState(false)
    const [permissionDenied, setPermissionDenied] = useState<boolean>(!claims?.includes('admin'))

    const setClaim = (uid: string, claimName: string, value: boolean) => {
        let promise = value ? addClaim(uid, claimName) : removeClaim(uid, claimName)
        promise
            .then((results) => {
                console.log(results)
            })
            .catch((error) => console.log(error))
    }
    const toggleAdmin = () => {
        if (!selectedMember) return
        setIsAdmin((previousState) => {
            setClaim(selectedMember.value, 'admin', !previousState)
            return !previousState
        })
    }
    const toggleManager = () => {
        if (!selectedMember) return
        setIsManager((previousState) => {
            setClaim(selectedMember.value, 'manager', !previousState)
            return !previousState
        })
    }
    const toggleModerator = () => {
        if (!selectedMember) return
        setIsModerator((previousState) => {
            setClaim(selectedMember.value, 'moderator', !previousState)
            return !previousState
        })
    }

    // Update the 'users' state
    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        const typedSnapshot = snapshot as QuerySnapshot<DocumentData>
        var newState: PickerItem[] = []
        typedSnapshot.docs.forEach((docRef) => {
            const push = async (docRef: DocumentData) => {
                const name = await docRef.get('displayName')
                newState.push({
                    label: name || `{${docRef.id}}`,
                    value: docRef.id,
                })
            }
            push(docRef)
                .then(() => setMembers(newState))
                .catch((err) => console.error(err))
        })
    }, [snapshot])

    useEffect(() => {
        if (!selectedMember) setSelectedMember(members[0])
    }, [members])

    useEffect(() => {
        if (!selectedMember) {
            setIsAdmin(false)
            setIsManager(false)
            setIsModerator(false)
            return
        }
        setLoadingClaims(true)
        getClaims(selectedMember.value).then((claims) => {
            setIsAdmin(claims?.admin)
            setIsManager(claims?.manager)
            setIsModerator(claims?.moderator)
            setLoadingClaims(false)
        }).catch((err) => console.warn(err))
    }, [selectedMember])

    let render = <ActivityIndicator />
    if (errorCollection || permissionDenied) {
        render = (
            <DisplayError
                permissionDenied={
                    (errorCollection as Error)?.message === 'permission-denied' ||
                    permissionDenied
                }
            />
        )
    } else if (!loadingCollection) {
        render = (
            <>
                <View>
                    <Picker
                        data={members}
                        onValueChanged={(newValue) => setSelectedMember(newValue)}
                    />
                </View>
                <View style={Styles.views.flexRowJustifyCenter}>
                    <LabeledSwitch
                        style={{ marginRight: 15 }}
                        isLoading={loadingClaims}
                        label="Admin"
                        value={!!isAdmin}
                        onChange={toggleAdmin}
                    />
                    <LabeledSwitch
                        style={{ marginRight: 15 }}
                        isLoading={loadingClaims}
                        label="Manager"
                        value={!!isManager}
                        onChange={toggleManager}
                    />
                    <LabeledSwitch
                        isLoading={loadingClaims}
                        label="Moderator"
                        value={!!isModerator}
                        onChange={toggleModerator}
                    />
                </View>
            </>
        )
    }

    return (
        <Screen navigation={navigation} title={'Manage User Roles'}>
            <Container>{render}</Container>
        </Screen>
    )
}
