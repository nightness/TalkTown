import React from 'react'
import { useDocumentData } from './Firebase'
import { ActivityIndicator, DisplayError, FlatList } from '../components'
import { ListRenderItem, StyleProp, ViewStyle } from 'react-native'
import { FirebaseError } from './Firebase'
import { Styles } from '../app/Styles'

interface Props<T> {
    style: StyleProp<ViewStyle> | object
    documentPath: string
    renderItem: ListRenderItem<T>
    orderBy?: string
    initialNumToRender?: number
    autoScrollToEnd?: boolean
}

export default function _<T>({
    style,
    documentPath,
    renderItem,
    orderBy,
    initialNumToRender,
    autoScrollToEnd,
    ...restProps
}: Props<T>) {
    const [document, loadingDocument, errorDocument] = useDocumentData(documentPath)

    const loadMore = () => {
        console.log('loadMore() : Start')
        //setRefreshing(true)
    }

    if (loadingDocument)
        return <ActivityIndicator />

    if (errorDocument) {
        const error = errorDocument === true ? new Error('Unknown Firebase Error') : errorDocument as Error
        return (
            <DisplayError
                permissionDenied={
                    (errorDocument as FirebaseError)?.code === 'permission-denied'
                }
                error={error}
            />
        )
    }

    return (
        <FlatList<T>
            style={{}}
            renderItem={renderItem}
            //@ts-ignore
            data={document.recentMessages}
            onStartReached={loadMore}
            {...restProps}
        />
    )
}
