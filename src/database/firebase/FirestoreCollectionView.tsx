import React, { useState, useEffect, useContext } from 'react'
import {
    useCollection,
    FirebaseError,
    getDocumentsDataWithId,
    getData,
    DocumentData,
    QuerySnapshot,
} from '.'
import { ActivityIndicator, DisplayError, FlatList, ScreenContext } from '@components'
import { ListRenderItem, StyleProp, View, ViewStyle } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GradientColors } from '@app/GradientColors'
import { Styles } from '@app/Styles'

interface Props<T> {
    collectionPath: string
    renderItem: ListRenderItem<T>
    orderBy?: string
    limitLength?: number
    initialNumToRender?: number
    autoScrollToEnd?: boolean
}

export default function _<T>({
    collectionPath,
    renderItem,
    orderBy,
    limitLength,
    initialNumToRender,
    autoScrollToEnd,
    ...restProps
}: Props<T>) {
    const [snapshot, loadingCollection, errorCollection] = useCollection(collectionPath)
    const [messages, setMessages] = useState([])
    const [loadingData, setDataLoading] = useState(true)
    const [errorData, setDataError] = useState(false)
    const { activeTheme } = useContext(ScreenContext)

    const fetchData = () => {
        const querySnapshot = snapshot as QuerySnapshot<DocumentData>
        getData(querySnapshot, orderBy, limitLength)
            .then((documentRef) => {
                // @ts-ignore
                setMessages(getDocumentsDataWithId(documentRef))
                setDataLoading(false)
            })
            .catch((e) => {
                setDataError(e)
                setDataLoading(false)
            })
    }

    const loadMoreMessages = () => {
        console.log('loadMoreMessages() : Start')
        //setRefreshing(true)
    }

    useEffect(() => {
        if (!loadingCollection && !errorCollection && snapshot)
            fetchData()
    }, [snapshot])

    if (loadingCollection || loadingData)
        return <ActivityIndicator />
    if (errorCollection || errorData) {
        const error = (errorCollection === true ? new Error('Unknown Firebase Error') :
            (errorCollection !== undefined ? errorCollection as Error : undefined) ||
            (errorData === true ? new Error('Unknown Firebase Error') : undefined))
        return (
            <DisplayError
                permissionDenied={
                    (errorCollection as FirebaseError)?.code === 'permission-denied'
                }
                error={error}
            />
        )
    }
    return (
        <LinearGradient
            colors={GradientColors[activeTheme].secondary}
            style={{ flex: 1 }}
        >
            <FlatList<T>
                style={{ width: '100%' }}
                viewStyle={{ alignItems: 'baseline' }}
                renderItem={renderItem}
                data={messages}
                onStartReached={loadMoreMessages}
                autoScrollToEnd={autoScrollToEnd}
                {...restProps}
            />
        </LinearGradient>
    )
}
