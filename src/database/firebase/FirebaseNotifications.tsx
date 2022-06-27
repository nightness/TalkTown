import React, { useContext, useEffect } from 'react'
import { DocumentData, QuerySnapshot } from 'firebase/firestore'
import { User } from 'firebase/auth'
import { GlobalContext } from '@app/GlobalContext'
import { useCollection } from '.'

interface Props {
    currentUser?: User | null
}

export default ({ currentUser }: Props) => {
    const path = `/notifications/${currentUser?.uid}/webRTC`
    const [snapshot, loadingCollection, errorCollection] = useCollection(path)
    const { showToast } = useContext(GlobalContext)

    //console.log(`FirebaseNotifications: currentUid: ${currentUser?.uid}, ${path}`)

    // Listen for new notifications
    useEffect(() => {
        if (loadingCollection || errorCollection || !snapshot) return
        (snapshot as QuerySnapshot<DocumentData>).docChanges().forEach((data) => {
            //showToast({ type: 'info', text1: "title", text2: data.doc.id })
        })

    }, [snapshot])

    useEffect(() => {
        //console.log(`loadingCollection == ${loadingCollection}`)
    }, [loadingCollection])

    useEffect(() => {
        if (currentUser && errorCollection !== undefined)
            console.error(`Firebase Notification Collection Error: ${errorCollection}`)
    }, [errorCollection])

    // No visual
    return <></>
}
