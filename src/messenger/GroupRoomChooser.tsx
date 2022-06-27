import React, { useState, useContext, useEffect, useRef } from 'react'
import { ActivityIndicator, Button, DisplayError, Screen, ScrollView, Text, ScreenContext, Themes } from '../components'
import { StackNavigationProp } from '@react-navigation/stack'
import { DocumentData, FirebaseError, QueryDocumentSnapshot, QuerySnapshot, useCollection } from '../database/firebase'
import { Styles } from '../app/Styles'
import { FlatList, View } from 'react-native'
import { DrawerContext, NavigationElement } from '../navigation'
import DynamicMessenger from './DynamicMessenger'

interface ScreenConfig {
    title: string,
    navigation: StackNavigationProp<any, string>
    collectionPath: string
    documentId: string
}

const buildScreenConfig = ({ title, navigation, collectionPath, documentId }: ScreenConfig) => {
    return ({
        // Route names needs to be unique for routing to work, but labels do not need to be unique
        label: `#${title}`,
        routeName: `#${title}`,
        component: () => (
            <DynamicMessenger
                navigation={navigation}
                collectionPath={collectionPath}
                documentId={documentId}
                title={`#${title}`}
            />
        ),
        initialParams: {
            activeTintColor: '#642',
            inactiveTintColor: '#642',
            iconGroup: 'antdesign',
            iconName: 'paperclip',
            focusedIconName: 'bug-outline'
        },
        depth: 1
    }) as NavigationElement
}

// QueryDocumentSnapshot<firebase.firestore.DocumentData>
interface RoomDetailsProps {
    data: QueryDocumentSnapshot<DocumentData>
    navigation: StackNavigationProp<any, string>
}

const RoomDetails = ({ data, navigation }: RoomDetailsProps) => {
    const collectionPath = `${data.ref.path}/messages`
    const { screens, screenIndex, ScreenManager, setBadge } = useContext(DrawerContext)
    const [messageCount, setMessageCount] = useState<number | undefined>();
    const [snapshot, loadingCollection, errorCollection] = useCollection(collectionPath)
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)
    const themeStyle = getThemedComponentStyle('Screen')[activeTheme]
    const docData = data.data()
    const routeName = `#${docData.name}`

    useEffect(() => {
        if (loadingCollection || errorCollection) return
        const snap = snapshot as QuerySnapshot<DocumentData>
        setMessageCount(snap.docs.length)
    }, [snapshot])

    useEffect(() => {
        console.log(routeName)
        screens.forEach((screen) => {
            if (screen.routeName === routeName)
                navigation.navigate(routeName)
        })

    }, [screens])

    return (
        <Button
            style={[{
                borderRadius: 10,
                borderWidth: 2,
                paddingVertical: 5,
                paddingHorizontal: 10,
                marginTop: 5,
                marginHorizontal: 10,
                alignItems: 'baseline'
            }, themeStyle]}
            onPress={() => {
                let exists = false
                screens.forEach((screen) => {
                    if (screen.routeName === routeName) {
                        exists = true
                        navigation.navigate(routeName)
                    }
                })
                if (!exists && ScreenManager?.addChild && typeof screenIndex === 'number' && screenIndex >= 0) {
                    const screenConfig = buildScreenConfig({
                        title: docData.name,
                        navigation,
                        collectionPath,
                        documentId: data.id
                    })
                    const path = ScreenManager.getScreenPath(screenIndex)
                    if (!path) throw new Error('Path Not Found')
                    ScreenManager.addChild(path, screenConfig)
                }
            }}
        >
            <View>
                <Text>
                    <Text style={{ fontWeight: '600' }}>Name: </Text>{docData.name}
                </Text>
                {docData.description ?
                    <Text>
                        <Text style={{ fontWeight: '600' }}>Description: </Text>{docData.description}
                    </Text> : <></>
                }
                <Text>
                    <Text style={{ fontWeight: '600' }}>Joined Member Count: </Text>
                    {docData.members ? docData.members.length : 0}
                </Text>
                {messageCount ?
                    <Text>
                        <Text style={{ fontWeight: '600' }}>Message Count: </Text>
                        <Text>{`${messageCount}`}</Text>
                    </Text> : <></>
                }
            </View>
        </Button >
    )
}

interface Props {
    navigation: StackNavigationProp<any>
}

export default ({ navigation }: Props) => {
    const [snapshot, loadingCollection, errorCollection] = useCollection('/groups')

    if (loadingCollection) {
        return (
            <Screen navigation={navigation} title=''>
                <ActivityIndicator />
            </Screen>
        )
    } else if (errorCollection) {
        return <DisplayError error={errorCollection as FirebaseError} />
    }

    // Note: Fairly low cost to re-render every time (for now)
    const snapData: QueryDocumentSnapshot<DocumentData>[] = []
    const snap = snapshot as QuerySnapshot<DocumentData>
    snap.docs.forEach((doc) => snapData.push(doc))

    return (
        <Screen navigation={navigation} title={'Group Chat Rooms'}>
            <FlatList
                data={snapData}
                renderItem={({ item }) =>
                    <RoomDetails
                        key={`${Math.random()}`}
                        data={item}
                        navigation={navigation}
                    />
                }
                style={{ flex: 1 }}
                bounces={false}
            />
        </Screen >
    )
}
