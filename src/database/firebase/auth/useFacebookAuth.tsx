import React, { useEffect, useState } from 'react';

import { FacebookAuthRequestConfig, useAuthRequest } from 'expo-auth-session/providers/facebook';
import Constants from 'expo-constants';
import { Alert, Platform } from 'react-native';
import { getAuth, FacebookAuthProvider, signInWithCredential, signInWithRedirect } from 'firebase/auth';
// import { Facebook } from 'expo-facebook';

import { FirebaseContext, FirebaseError, clientIds, androidClientId, iosClientId, webClientId } from '@data/firebase';
import { tvLog } from '@shared';
import { AuthSessionRedirectUriOptions, makeRedirectUri } from 'expo-auth-session';
import useSignIn from './useSignIn'


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

// const options: Facebook.FacebookOptions = {
// 	permissions: ['public_profile', 'email', 'user_age_range'],
// };

const useFacebookAuth = () => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>()
	const webSignIn = useSignIn();

	const [request, response, promptAuthAsync] = useAuthRequest(config, authOptions);

	// Logging... this is the request we send to the provider
	// useEffect(() => {
	// 	console.log(`useFacebookAuth: (request): ${JSON.stringify(request)}`);
	// }, [request]);

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
				// const credential = FacebookAuthProvider.credentialFromResult(result);
				// const accessToken = credential?.accessToken;
				// const idToken = credential?.idToken;

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

// const useFacebookAuth4 = () => {
// 	const [isAuthenticating, setIsAuthenticating] = useState(false);
// 	const [errorMessage, setErrorMessage] = useState<string>();

// 	const promptAuthAsync = async () => {
// 		try {
// 			await Facebook.initializeAsync({
// 				version: '12',
// 				autoLogAppEvents: true,
// 				domain: 'tvpal.appwebtech.com',
// 				appId: '357528419576921',
// 				appName: 'TVPal',				
// 			});
// 			const result = await Facebook.logInWithReadPermissionsAsync({
// 				permissions: ['public_profile'],
// 			});
// 			if (result.type === 'success') {
// 				// Get the user's name using Facebook's Graph API
// 				const response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}`);
// 				Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
// 			} else {
// 				// type === 'cancel'
// 			}
// 		} catch ({ message }) {
// 			alert(`Facebook Login Error: ${message}`);
// 		}
// 	};

// 	const signInWithFacebook = async () => {
// 		if (isAuthenticating) {
// 			console.log('useFacebookAuth: Already authenticating a signIn');
// 			return;
// 		}
// 		setErrorMessage(undefined);
// 		setIsAuthenticating(true);
// 		if (Platform.OS === 'web') {
// 			try {
// 				const provider = new FacebookAuthProvider();
// 				provider.setCustomParameters({
// 					// Force re-consent.
// 					// prompt: 'consent',
// 					// auth_type: 'reauthenticate',
// 					// auth_nonce: '{random-nonce}'
// 				});
// 				const result = await signInWithRedirect(getAuth(), provider);
// 				const credential = FacebookAuthProvider.credentialFromResult(result);
// 				const accessToken = credential?.accessToken;
// 				const idToken = credential?.idToken;

// 				console.log('useFacebookAuth: ', credential, accessToken, idToken);
// 			} catch (error: any) {
// 				setErrorMessage(JSON.stringify(error));
// 				alert(error);
// 			} finally {
// 				setIsAuthenticating(false);
// 			}
// 		} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
// 			promptAuthAsync();
// 		}
// 	};

// 	return [isAuthenticating, errorMessage, signInWithFacebook];
// };


// const useFacebookAuth2 = () => {
// 	const [isAuthenticating, setIsAuthenticating] = useState(false);
// 	const [errorMessage, setErrorMessage] = useState<string>();

// 	// Alert user of errors
// 	useEffect(() => {
// 		if (!errorMessage) return;
// 		alert(errorMessage);
// 	}, [errorMessage]);

// 	const promptAuthAsync = async () => {
// 		try {
// 			const data = await Facebook.logInWithReadPermissionsAsync(options);
// 			console.log('data', data);
// 			switch (data.type) {
// 				case 'success': {
// 					// Get the user's name using Facebook's Graph API
// 					const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${data.token}`);
// 					const profile = await response.json();
// 					console.log('response', response);
// 					console.log('profile', profile);
// 					Alert.alert('Logged in!', `Hi ${profile.name}!`);
// 					setIsAuthenticating(false);
// 					break;
// 				}
// 				case 'cancel': {
// 					setIsAuthenticating(false);
// 					setErrorMessage('Login was cancelled!');
// 					break;
// 				}
// 				default: {
// 					setIsAuthenticating(false);
// 					setErrorMessage('Login failed!');
// 				}
// 			}
// 		} catch (e) {
// 			setIsAuthenticating(false);
// 			setErrorMessage(`(1) ${JSON.stringify(e)}`);
// 		}
// 	};

// 	const signInWithFacebook = async () => {
// 		if (isAuthenticating) {
// 			console.log('useFacebookAuth: Already authenticating a signIn');
// 			return;
// 		}
// 		setErrorMessage(undefined);
// 		setIsAuthenticating(true);
// 		if (Platform.OS === 'web') {
// 			try {
// 				const provider = new FacebookAuthProvider();
// 				provider.setCustomParameters({
// 					// Force re-consent.
// 					// prompt: 'consent',
// 					// auth_type: 'reauthenticate',
// 					// auth_nonce: '{random-nonce}'
// 				});
// 				const result = await signInWithRedirect(getAuth(), provider);
// 				const credential = FacebookAuthProvider.credentialFromResult(result);
// 				const accessToken = credential?.accessToken;
// 				const idToken = credential?.idToken;

// 				console.log('useFacebookAuth: ', credential, accessToken, idToken);
// 			} catch (error: any) {
// 				setErrorMessage(JSON.stringify(error));
// 				alert(error);
// 			} finally {
// 				setIsAuthenticating(false);
// 			}
// 		} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
// 			promptAuthAsync();
// 		}
// 	};

// 	return [isAuthenticating, errorMessage, signInWithFacebook];
// };

export default useFacebookAuth;
