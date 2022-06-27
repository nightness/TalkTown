import React, { useEffect, useState } from 'react';

import { useAuthRequest, useIdTokenAuthRequest } from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getAuth, GoogleAuthProvider, signInWithCredential, signInWithRedirect, signInWithPopup, } from 'firebase/auth';

import { clientIds } from '../database/firebase';

// Redirect's fuck up debugging authentication, use popup's for __DEV__
const useSignIn = () => __DEV__ ? signInWithPopup : signInWithRedirect;

const authOptions = {
	scheme: 'talktown',
	path: 'redirect',
};

const useGoogleAuth = () => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const webSignIn = useSignIn();

	if (Constants.appOwnership === 'expo' && Platform.OS === 'android') {
		// Works with Expo GO (for managed)
		var [request, response, promptAuthAsync] = useIdTokenAuthRequest(clientIds, authOptions);
	} else {
		// Doesn't work with Expo GO (for standalone)
		var [request, response, promptAuthAsync] = useAuthRequest(clientIds, authOptions);
	}

	// Logging... this is the request we send to the provider
	useEffect(() => {
		// console.log(`useGoogleAuth: (request): ${JSON.stringify(request)}`);
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
			const credential = GoogleAuthProvider.credential(id_token);
			signInWithCredential(getAuth(), credential).then(
				(userCredential) => {
					// Success
					console.log('useGoogleAuth: Successful native login');
					setIsAuthenticating(false);
				},
				(reason) => {
					// Failure
					console.log(`useGoogleAuth: Failed native login: ${JSON.stringify(reason)}`);
					setIsAuthenticating(false);
					setErrorMessage(JSON.stringify(reason));
				}
			);
		} else if (response) {
			setIsAuthenticating(false);
			setErrorMessage(JSON.stringify(response));
		} else {
			setIsAuthenticating(false);
		}
	}, [response]);

	const signInWithGoogle = async () => {
		if (isAuthenticating) {
			console.log('useGoogleAuth: Already authenticating a signIn')
			return;
		}
		setErrorMessage(undefined);
		setIsAuthenticating(true);
		if (Platform.OS === 'web') {
			try {
				const provider = new GoogleAuthProvider();
				const result = await webSignIn(getAuth(), provider);
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const accessToken = credential?.accessToken;
				const idToken = credential?.idToken;

				setIsAuthenticating(false);
				console.log('useGoogleAuth: ', credential, accessToken, idToken);
			} catch (error: any) {
				setIsAuthenticating(false);
				setErrorMessage(JSON.stringify(error));
				alert(error);
			}
		} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
			promptAuthAsync();
		}
	};

	return [isAuthenticating, errorMessage, signInWithGoogle];
};

export default useGoogleAuth;
