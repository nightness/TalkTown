import 'react-native-gesture-handler';
import React, { useReducer } from 'react';
import {
	DefaultNavigatorOptions,
	TabRouterOptions,
} from '@react-navigation/native';
import {
	createDrawerNavigator,
	DrawerNavigationOptions,
} from '@react-navigation/drawer';
import { DrawerProvider } from './DrawerContext';
import DrawerContent from './DrawerContent';
import { ScreensReducer } from './RoutingReducer';
import { Gradient, NavigationElements } from './NavigationTypes';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { FirebaseUser } from 'src/database/firebase';
import { UserClaimsResponse } from '../database/firebase/types';

const Drawer = createDrawerNavigator();

type DrawerProps = React.ComponentType<
	Omit<React.ComponentProps<any>, keyof DefaultNavigatorOptions<any, any>> &
		DefaultNavigatorOptions<any, any>
>;

type Props = DrawerNavigationOptions &
	TabRouterOptions & {
		children?: JSX.Element | JSX.Element[];
		initialScreens: NavigationElements;
		currentUser?: FirebaseUser;
        claims?: UserClaimsResponse;
		detachInactiveScreens?: boolean;
		background?: string | Gradient;
		drawerStyle?: StyleProp<ViewStyle>;
		labelStyle?: StyleProp<TextStyle>;
		backBehavior?: 'initialRoute' | 'firstRoute' | 'history' | 'order' | 'none';
		drawerPosition?: 'left' | 'right';
		drawerType?: 'front' | 'back' | 'slide' | 'permanent';
		edgeWidth?: number;
		initialRouteName?: string;
		keyboardDismissMode?: 'on-drag' | 'none';
		lazy?: boolean;
		minSwipeDistance?: number;
		openByDefault?: boolean;
		overlayColor?: string;
	};

export default ({
	initialScreens,
    claims,
	currentUser,
	children: parentChildren,
	detachInactiveScreens,
	drawerPosition,
	drawerType,
	drawerStyle,
	backBehavior,
	edgeWidth,
	initialRouteName,
	keyboardDismissMode,
	lazy,
	minSwipeDistance,
	openByDefault,
	overlayColor,
	...restProps
}: Props) => {
	// The stateful list of screens
	const [screens, screensDispatch] = useReducer(ScreensReducer, initialScreens);

	const parentStack: string[] = [];
	let currentDepth = -1;

	return (
		<DrawerProvider
			activeClaims={claims}
			screens={screens}
			screensDispatch={screensDispatch}
		>
			<Drawer.Navigator
				detachInactiveScreens={detachInactiveScreens}
				drawerPosition={drawerPosition}
				drawerType={drawerType}
				backBehavior={backBehavior}
				drawerStyle={drawerStyle}
				edgeWidth={edgeWidth}
				initialRouteName={initialRouteName}
				keyboardDismissMode={keyboardDismissMode}
				lazy={lazy}
				minSwipeDistance={minSwipeDistance}
				openByDefault={openByDefault}
				overlayColor={overlayColor}
				drawerContent={(props) => <DrawerContent {...restProps} {...props} />}
				screenOptions={{
					headerShown: false,                    
					headerStyle: {
						height: 0,
					},
					header: (props) => <></>, // Empty Header                
				}}

			>
				{screens.map((screen, index) => {
					const depthDelta = screen.depth - currentDepth;
					if (depthDelta > 1)
						throw new Error(
							'depth step up is > 1, grandchildren with no children?'
						);
					// Depth increased since last screen
					if (screen.depth > currentDepth) {
						currentDepth++;
						parentStack.push(screen.routeName);
					}
					// Depth decreased since last screen
					if (screen.depth < currentDepth) {
						for (let i = depthDelta; i > 0; i--) {
							parentStack.pop();
						}
					}

					// This sets isRestricted for each screen based on claims first,
					// and existing isRestricted value secondly
					screens[index].isRestricted = !screen.claims
						? !!screen?.isRestricted
						: screen.claims.filter((value) => (claims as any)?.[value]).length === 0;

					// Return the Drawer.Screen
					return (
						<Drawer.Screen
							name={screen.routeName}
							component={screen.component}
							initialParams={screen.initialParams}
							key={`Drawer.Screen[${parentStack.join(
								String.fromCharCode(255)
							)}]`}
						/>
					);
				})}
			</Drawer.Navigator>
		</DrawerProvider>
	);
};
