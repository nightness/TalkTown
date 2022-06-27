import React, { useEffect, useState } from 'react';

import {
	AuthRequestConfig,
	AuthRequestPromptOptions,
	DiscoveryDocument,
	makeRedirectUri,
	useAuthRequest,
} from 'expo-auth-session';

import Constants from 'expo-constants';
import { Platform } from 'react-native';
import {
	getAuth,
	FacebookAuthProvider,
	signInWithCredential,
	signInWithRedirect,
	OAuthProvider,
} from 'firebase/auth';
import { androidClientId, clientIds, iosClientId, webClientId } from '@data/firebase';

import { tvLog } from '@shared';
import useSignIn from './useSignIn';

const authOptions: AuthRequestPromptOptions = {
	scheme: 'talktown',
	path: 'redirect',
};

const redirectUri = makeRedirectUri(authOptions);

const clientId = Platform.select({
	android: androidClientId,
	ios: iosClientId,
	default: webClientId,
});

const config: AuthRequestConfig = { ...clientIds, clientId, redirectUri };

const discovery: DiscoveryDocument = {};

const useMicrosoftAuth = () => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const webSignIn = useSignIn();

	// const [request, response, promptAuthAsync] = useAuthRequest(config, discovery);
	const [request, response, promptAuthAsync] = useAuthRequest(config, authOptions);

	// Logging, this is the request we send to google
	useEffect(() => {
		// console.log(`useMicrosoftAuth: (request): ${JSON.stringify(request)}`);
	}, [request]);

	// Alert user of errors
	useEffect(() => {
		if (!errorMessage) return;
		alert(errorMessage);
	}, [errorMessage]);

	// Handles the response from google authentication (iOS / Android / Expo Go)
	useEffect(() => {
		if (response?.type === 'success') {
			const { id_token } = response.params;
			alert(JSON.stringify(response));
			setIsAuthenticating(false);
			// OAuthProvider.credentialFromResult(response.authentication)
			// const credential = OAuthProvider.credentialFromResult(id_token);
			// signInWithCredential(getAuth(), credential).then(
			// 	(userCredential) => {
			// 		// Success
			// 		setIsAuthenticating(false);
			// 		console.log('useMicrosoftAuth: Successful native login');
			// 	},
			// 	(reason) => {
			// 		// Failure
			// 		setIsAuthenticating(false);
			// 		setErrorMessage(JSON.stringify(reason));
			// 		console.log(`useMicrosoftAuth: Failed native login: ${JSON.stringify(reason)}`);
			// 	}
			// );
		} else if (response) {
			setIsAuthenticating(false);
			setErrorMessage(JSON.stringify(response));
			console.log(
				`useMicrosoftAuth: OAUTH response
				${JSON.stringify(response, null, 2)}`
			);
		} else {
			setIsAuthenticating(false);
		}
	}, [response]);

	const signInWithMicrosoft = async () => {
		setErrorMessage(undefined);
		setIsAuthenticating(true);
		if (Platform.OS === 'web') {
			try {
				const provider = new OAuthProvider('microsoft.com');
				provider.setCustomParameters({
					// Force re-consent.
					prompt: 'consent',
				});
				const result = await webSignIn(getAuth(), provider);
				const credential = OAuthProvider.credentialFromResult(result);
				const accessToken = credential?.accessToken;
				const idToken = credential?.idToken;

				setIsAuthenticating(false);
				console.log('UseMicrosoftAuth: ', credential, accessToken, idToken);
			} catch (error: any) {
				setErrorMessage(JSON.stringify(error));
				alert(error);
			} finally {
				setIsAuthenticating(false);
			}
		} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
			// promptAuthAsync();
		}
	};

	return [isAuthenticating, errorMessage, signInWithMicrosoft];
};

export default useMicrosoftAuth;
