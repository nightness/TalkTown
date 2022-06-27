import React, { useContext, useEffect, useState } from 'react';
import {
	StyleProp,
	ViewStyle,
	View,
	useWindowDimensions,
	SafeAreaView,
} from 'react-native';

import { GlobalContext } from '@app/GlobalContext';
import { FirebaseContext } from '@database/firebase/FirebaseContext';
import { GradientColors } from '@app/GradientColors';

import ScreenHeader from './ScreenHeader';
import { ScreenContext } from './ScreenContext';
import { Container } from '.';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
	children: JSX.Element | JSX.Element[];
	style?: object;
	navigation?: any;
	title: string;
}

export default ({ children, style, navigation, title }: Props) => {
	const { hamburgerBadgeText } = useContext(GlobalContext);
	const { activeTheme, screenOrientation, isKeyboardOpen, keyboardHeight } =
		useContext(ScreenContext);
	//   const { width, height } = useWindowDimensions();
	const { currentUser } = useContext(FirebaseContext);
	//   const [screenStyle, setScreenStyle] = useState<StyleProp<ViewStyle>>({
	//     height,
	//     width,
	//     position: "absolute",
	//   });

	//   useEffect(() => {
	//     if (isKeyboardOpen && height) {
	//       setScreenStyle({
	//         height: height - keyboardHeight,
	//         width,
	//         position: "absolute",
	//       });
	//     } else {
	//       setScreenStyle({
	//         height,
	//         width,
	//         position: "absolute",
	//       });
	//     }
	//   }, [isKeyboardOpen, keyboardHeight, screenOrientation, width, height]);

	const screenStyle = {
		height: '100%',
		width: '100%',
	};

	return (
		<SafeAreaView style={[screenStyle, style]}>
			<Container
				style={screenStyle}
				background={GradientColors[activeTheme].background}
			>
				<>
					<ScreenHeader
						navigation={navigation}
						title={title}
						photoURL={currentUser && currentUser.photoURL}
						hamburgerBadgeText={hamburgerBadgeText}
					/>
					<LinearGradient
						colors={GradientColors[activeTheme].background}
						style={screenStyle}
					>
						{children}
					</LinearGradient>
				</>
			</Container>
		</SafeAreaView>
	);
};
