import 'react-native-gesture-handler'
import React, { useContext, useEffect, useState } from 'react'
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { ActivityIndicator, DisplayError, ScreenContext } from '../components'
import { FirebaseUser, useAuthState } from '../database/firebase'
import { DrawerNavigator } from '../navigation'
import Authentication from '../screens/Authentication'
import { initialNavigationElements } from './DefaultRoutes'
import { FirebaseContext } from '../database/firebase/FirebaseContext'
import { GradientColors } from '../app/GradientColors'
import { Styles } from '../app/Styles'
import { GlobalContext } from '../app/GlobalContext'
import Toast from '../components/Toast'
import LoginActivity from '../screens/LoginActivity'
import { SafeAreaView } from 'react-native'

export const Stack = createStackNavigator()
export default () => {
    const [user, firebaseLoading, firebaseError] = useAuthState()
    const { activeTheme, getThemedComponentStyle } = useContext(ScreenContext)
    const { messages, setMessages } = useContext(GlobalContext)
    const { currentUser, claims } = useContext(FirebaseContext)
    const colorSet = GradientColors[activeTheme]


    // headerShown: false,
    // headerStyle: { height: 0 },
    // header: (props) => <></>, // Empty Header                    


    if (firebaseLoading) return (
        <ActivityIndicator />
    )
    if (firebaseError) {
        const error = new Error(firebaseError.message ? firebaseError.message : firebaseError.code)
        return <DisplayError error={error} />
    }
    return (
        <NavigationContainer theme={activeTheme === 'Dark' ? DarkTheme : DefaultTheme}>
            <Stack.Navigator
                defaultScreenOptions={{
                    animationEnabled: false,
                    headerShown: false,
                    headerStyle: {
                        height: 0,
                    },
                    header: (props) => <></>, // Empty Header                    
                }}
                screenOptions={{
                    animationEnabled: false,
                    headerShown: false,                    
                    headerStyle: {
                        height: 0,
                    },
                    header: (props) => <></>, // Empty Header                
                }}
                // initialRouteName={'Main'}
                initialRouteName={user ? 'Main' : 'Authentication'}
            >
                <Stack.Screen name="Authentication" component={Authentication} />
                <Stack.Screen name="LoginActivity" component={LoginActivity}  />
                <Stack.Screen name="Main">
                    {props => (
                        <DrawerNavigator
                            {...props}
                            background={colorSet.drawer}
                            currentUser={currentUser as FirebaseUser}
                            claims={claims}
                            initialScreens={initialNavigationElements}
                            labelStyle={getThemedComponentStyle('Text')[activeTheme]}
                            />
                                                     
                    )}

                </Stack.Screen>
            </Stack.Navigator>
            <Toast messages={messages} setMessages={setMessages} />
        </NavigationContainer>
    )
}
