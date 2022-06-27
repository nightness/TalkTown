import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { DefaultRouterOptions } from '@react-navigation/native';

import { GlobalContext } from '@app/GlobalContext';
import { Button, Screen, Text, TextInput } from '@components';
import useAsync from '@hooks/useAsync';
import { FirebaseContext } from '../database/firebase/FirebaseContext';
import {
	joinGroupCallable,
	leaveGroupCallable
} from '../database/firebase/types';
import { useComponentRef } from '../hooks/useComponentRef';
import { DrawerContext } from '../navigation';

interface Props {
	navigation: DefaultRouterOptions;
}

// Playground
export const Playground = ({ navigation }: Props) => {
	const { setBadge, ScreenManager, screenIndex } = useContext(DrawerContext);
	const { showToast, sendNotificationImmediately } = useContext(GlobalContext);
	const { authToken } = useContext(FirebaseContext);
	const { addClaim, getClaims, currentUser } = useContext(FirebaseContext);
	const [count, setCount] = useState(0);
	const [text, setText] = useState('');
	const [scrollContents, setScrollContents] = useState<string[]>([]);
	const [view, ref] = useComponentRef<View>((ref) => (
		<View
			ref={ref}
			style={{
				backgroundColor: 'black',
				zIndex: 10000,
				width: '100%',
				height: '100%',
			}}
		/>
	));

	const [status, error, result] = useAsync(async () => {
		const result = await fetch('https://swapi.dev/api/people/1');
		if (result.status !== 200 || result.ok === false) {
			console.log('error', result);
			throw new Error(`Status ${result.status}`);
		}
		return await result.json();
	}, [count]);

	const onChangeText = (text: string) => {
		setText(text);
	};

	const [textStatus, textError, textResult] = useAsync(async () => {
		let list = [];
		for (let i = 0; i < 2100; i++) {
			list.push(text);
		}
		setScrollContents(list);
	}, [text]);

	return (
		<Screen navigation={navigation} title="Playground">
			<Button
				title="Join a channel"
				onPress={async () => {
					const callable = await joinGroupCallable(
						authToken,
						`gZxCKotZO82cvDOdAfHW`
					);
					const results = await callable();
					const data = results.data;
					if (typeof data.type === 'string') {
						console.error(data.message);
						if (data.type === 'silent') return;
						alert(data.message);
					} else {
						console.log(data);
					}
				}}
			/>
			<Button
				title="Leave a channel"
				onPress={async () => {
					const callable = await leaveGroupCallable(
						authToken,
						`gZxCKotZO82cvDOdAfHW`
					);
					const results = await callable();
					const data = results.data;
					if (typeof data.type === 'string') {
						console.error(data.message);
						if (data.type === 'silent') return;
						alert(data.message);
					} else {
						console.log(data);
					}
				}}
			/>

			<Button
				title="Get Notifications"
				onPress={() => {
					// callFirebaseFunction('getNotifications', {})
					// 	.then((results) => {
					// 		const data = results.data;
					// 		if (typeof data.type === 'string') {
					// 			console.error(data.message);
					// 			if (data.type === 'silent') return;
					// 			alert(data.message);
					// 		} else {
					// 			console.log(data);
					// 		}
					// 	})
					// 	.catch((err) => console.warn(err));
				}}
			/>
			<Button
				title="Delete the Playground Screen"
				onPress={() => {
					if (ScreenManager?.removeScreen && screenIndex) {
						ScreenManager.removeScreen(screenIndex);
					}
				}}
			/>
			<Button
				title="Toast Test"
				onPress={() => {
					showToast(
						'Hello World!',
						`Hello World! ${Math.floor(Math.random() * 100)}`
					);
				}}
			/>
			<Button
				title="Notification Test"
				onPress={() => {
					sendNotificationImmediately?.('title', 'body');
				}}
			/>
			<Button
				title="Upgrade to admin"
				onPress={() => {
					if (!currentUser) return;
					addClaim(currentUser.uid, 'admin');
				}}
			/>
			<Button
				title="Update the async function"
				onPress={() => {
					setCount((prevCount) => prevCount + 1);
				}}
			/>
			<View style={{ flex: 1 }}>
				<TextInput onChangeText={onChangeText} value={text} />
				<ScrollView style={{ flex: 1 }}>
					{scrollContents.map((item, index) => (
						<Text key={index}>{item}</Text>
					))}
				</ScrollView>
			</View>
			{view}
		</Screen>
	);
};
