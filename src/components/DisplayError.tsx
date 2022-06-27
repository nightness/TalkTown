import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import Container from './Container'
import Text from './Text'

interface Props {
    permissionDenied?: boolean
    error?: Error
    suppressConsoleMessage?: boolean
}

export default ({ permissionDenied, error, suppressConsoleMessage }: Props) => {
    let errorMessageText = permissionDenied ? 'Permission Denied' :
        error?.message ? error?.message : 'Unknown Error Occurred'

    useEffect(() => {
        if (!suppressConsoleMessage) {
            if (typeof error === 'object')
                console.error(error)
            else
                console.error(errorMessageText)
        }
    }, [error])
    
    return (
        <Container style={localStyles.filletedBorderView}>
            <Text style={localStyles.displayErrorHeader}>
                {`Sorry, an ${!errorMessageText ? 'unknown error' : 'error'
                    } has occurred`}
            </Text>
            {errorMessageText ? (
                <Text style={localStyles.displayErrorText}>{errorMessageText}</Text>
            ) : <></>}
        </Container>
    )
}

const localStyles = StyleSheet.create({
    filletedBorderView: {
        flex: 1,
        margin: 0,
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        width: '100%',
    },
    displayErrorHeader: {
        paddingTop: 5,
        fontSize: 18,
        fontWeight: '600',
    },
    displayErrorText: {
        paddingTop: 5,
        paddingLeft: 10,
        fontSize: 14,
        fontWeight: '600',
    }
})
