import 'react-native-gesture-handler'; // Import dependency of react-native-screens
import { enableScreens } from 'react-native-screens'; // react-native-screens is a react-navigation dependency
import React, { Profiler, useEffect, useRef, useState } from 'react';
import { Platform, Linking } from 'react-native';
import * as Fonts from 'expo-font';
import AppLoading from 'expo-app-loading';

import { NavigationContainer } from '@react-navigation/native';
import { RecoilRoot } from 'recoil';
import { ErrorBoundary } from 'react-error-boundary';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import { themes } from './src/app/Themes';
import { GlobalProvider } from './src/app/GlobalContext';
import { FirebaseProvider } from './src/database/firebase/FirebaseContext';
import { ScreenProvider } from './src/components/ScreenContext';
import AppNavigator from './src/navigation/AppNavigator';

const queryClient = new QueryClient();

// Only on web
if (Platform.OS === 'web') {
	{
		// Inject style
		const style = document.createElement('style');
		style.textContent = `textarea, select, input, button { outline: none!important; }`;
		document.head.append(style);
	}
}

// Enable Screens
enableScreens();

// Limit the depth of console.trace
// Error.stackTraceLimit = 10;

// In production, fix these; don't suppress them
const initLogBox = ({ LogBox }: any) =>
	LogBox.ignoreLogs([
		'Require cycles',
		'multiple minute',
		'AsyncStorage',
		'Roboto',
		'fontFamily',
	]);
if (Platform.OS && Platform.OS !== 'web') {
	initLogBox(require('react-native'));
}

const includeReactQueryDevtools = false;

const getFonts = () =>
	Fonts.loadAsync({
		'serif-pro-black': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Black.ttf'),
		'serif-pro-bold': require('./assets/fonts/SourceSerifPro/SourceSerifPro-Bold.ttf'),
	});

// App Component
export default function App() {
	const [fontsLoaded, setFontsLoaded] = useState(false);
	if (!fontsLoaded) {
		return (
			<AppLoading
				startAsync={getFonts}
				onFinish={() => setFontsLoaded(true)}
				onError={(error) => console.error(error)}
			/>
		);
	}
	return (
		<RecoilRoot>
			<QueryClientProvider client={queryClient}>
				<GlobalProvider>
					<ScreenProvider themes={themes}>
						<FirebaseProvider>
							<AppNavigator />
						</FirebaseProvider>
					</ScreenProvider>
				</GlobalProvider>
				{__DEV__ && includeReactQueryDevtools && (
					<ReactQueryDevtools initialIsOpen={false} />
				)}
			</QueryClientProvider>
		</RecoilRoot>
	);
}
