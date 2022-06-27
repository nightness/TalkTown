import React, { useEffect, useRef, useState } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { Transition, Transitioning, TransitioningView } from 'react-native-reanimated'

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

interface Props {
    title: string,
    message: string
    key?: string
}

export function ToastMessage({ title, message, key }: Props): React.ReactElement {
    const opacity = useRef(new Animated.Value(0)).current;
    const height = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 750,
                useNativeDriver: true
            }),
            Animated.delay(2500),
            Animated.timing(height, {
                toValue: 0,
                duration: 750,
                useNativeDriver: true
            })
        ]).start()
        Animated.sequence([
            Animated.timing(opacity, {
                toValue: 1,
                delay: 2500,
                duration: 750,
                useNativeDriver: true
            }),
        ]).start()

    }, [])

    return (
        <Animated.View
            key={key}
            style={{
                opacity,
                transform: [
                    {
                        translateY: opacity.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0]
                        })
                    }
                ],
                height,
                margin: 10,
                marginBottom: 5,
                padding: 10,
                borderRadius: 4,
                shadowColor: 'black',
                shadowOffset: {
                    width: 0,
                    height: 3
                },
                shadowOpacity: 0.15,
                shadowRadius: 5,
                elevation: 6
            }} >
            {message}
        </Animated.View>
    )
}

export default ToastMessage