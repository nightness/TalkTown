import React, { useEffect, useState } from 'react';

import { FacebookAuthRequestConfig, useAuthRequest } from 'expo-auth-session/providers/facebook';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { getAuth, FacebookAuthProvider, signInWithCredential, signInWithRedirect, signInWithPopup } from 'firebase/auth';

import { FirebaseContext, FirebaseError, clientIds, androidClientId, iosClientId, webClientId } from '../../../firebase/index';
import { AuthSessionRedirectUriOptions, makeRedirectUri } from 'expo-auth-session';

// Redirect's fuck up debugging authentication, use popup's for __DEV__
const useSignIn = () => __DEV__ ? signInWithPopup : signInWithRedirect;

// Facebook Hashes... expo fetch:android:hashes

const authOptions: AuthSessionRedirectUriOptions = {
	scheme: 'talktown',
	path: 'redirect',
	useProxy: Constants.appOwnership === 'expo',	
};

const redirectUri = makeRedirectUri(authOptions);

const clientId = Platform.select({
	android: androidClientId,
	ios: iosClientId,
	default: webClientId,
});

const config: FacebookAuthRequestConfig = {
	...clientIds,
	clientId,
	redirectUri,
};

const useFacebookAuth = () => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>()
	const webSignIn = useSignIn();

	const [request, response, promptAuthAsync] = useAuthRequest(config, authOptions);

	// Alert user of errors
	useEffect(() => {
		if (!errorMessage) return;
		alert(errorMessage);
	}, [errorMessage]);

	// Handles the response from google authentication (iOS / Android / Expo Go)
	useEffect(() => {
		if (response?.type === 'success') {
			const { id_token } = response.params;
			const credential = FacebookAuthProvider.credential(id_token);
			signInWithCredential(getAuth(), credential).then(
				(userCredential) => {
					// Success
					setIsAuthenticating(false);
					console.log('useFacebookAuth: Successful native login');
				},
				(reason) => {
					// Failure
					setIsAuthenticating(false);
					setErrorMessage(JSON.stringify(reason));
					console.log(`useFacebookAuth: Failed native login: ${JSON.stringify(reason)}`);
				}
			);
		} else if (response) {
			setIsAuthenticating(false);
			setErrorMessage(JSON.stringify(response));
			console.log(
				`useFacebookAuth: OAUTH response
				${JSON.stringify(response, null, 2)}`
			);
		} else {
			setIsAuthenticating(false);
		}
	}, [response]);

	const signInWithFacebook = async () => {
		if (isAuthenticating) {
			console.log('useFacebookAuth: Already authenticating a signIn');
			return;
		}
		setErrorMessage(undefined);
		setIsAuthenticating(true);
		if (Platform.OS === 'web') {
			try {
				const provider = new FacebookAuthProvider();
				provider.setCustomParameters({
					// Force re-consent.
					// prompt: 'consent',
                    // auth_type: 'reauthenticate',
                    // auth_nonce: '{random-nonce}'
				});                
				const result = await webSignIn(getAuth(), provider);
				// console.log('useFacebookAuth: ', credential, accessToken, idToken);
			} catch (error: any) {
				setErrorMessage(JSON.stringify(error));
				alert(error);
			} finally {
				setIsAuthenticating(false);
			}
		} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
			promptAuthAsync();
		}
	};

	return [isAuthenticating, errorMessage, signInWithFacebook];
};

export default useFacebookAuth;
