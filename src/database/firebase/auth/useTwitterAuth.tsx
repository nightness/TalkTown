import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button, Platform } from 'react-native';

import { getAuth, FacebookAuthProvider, signInWithCredential, signInWithRedirect, OAuthProvider } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { androidClientId, iosClientId, webClientId } from '@data/firebase';
import useSignIn from './useSignIn';

const useProxy = Platform.select({ web: false, default: true });

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
	authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
	tokenEndpoint: 'https://twitter.com/i/oauth2/token',
	revocationEndpoint: 'https://twitter.com/i/oauth2/revoke',
};

const clientId = Platform.select({
	android: androidClientId,
	ios: iosClientId,
	default: webClientId,
});

const useTwitterAuth = () => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const webSignIn = useSignIn();

	const [request, response, promptAuthAsync] = useAuthRequest(
		{
			clientId: 'OGFVb01CR211NDZNb0xhVmxkcHE6MTpjaQ',
			redirectUri: makeRedirectUri({
				scheme: 'talktown',
			}),
			usePKCE: true,
			// scopes: ['tweet.read'],
		},
		discovery
	);

	// Logging... this is the request we send to the provider
	useEffect(() => {
		// console.log(`useTwitterAuth: (request): ${JSON.stringify(request)}`);
	}, [request]);

	useEffect(() => {
		if (!response) return;
		if (response.type === 'success') {
			const { parm, authentication, url } = response.params;
			// const { id_token } = response.params;
			alert(JSON.stringify(response));
			setIsAuthenticating(false);
		} else if (response.type === 'error') {
			setIsAuthenticating(false);
			setErrorMessage(response.error?.message);
			alert(response.error?.message);
		} else if (response) {
			setIsAuthenticating(false);
			setErrorMessage(JSON.stringify(response));
			console.log(
				`useTwitterAuth: OAUTH response
				${JSON.stringify(response, null, 2)}`
			);
		}
	}, [response]);

	const signInWithTwitter = async () => {
		if (isAuthenticating) {
			console.log('useTwitterAuth: Already authenticating a signIn');
			return;
		}
		setErrorMessage(undefined);
		setIsAuthenticating(true);
		if (Platform.OS === 'web') {
			try {
				const provider = new OAuthProvider('twitter.com');
				const result = await webSignIn(getAuth(), provider);
				const credential = OAuthProvider.credentialFromResult(result);
				const accessToken = credential?.accessToken;
				const idToken = credential?.idToken;
				console.log('useTwitterAuth: ', credential, accessToken, idToken);

				setIsAuthenticating(false);
			} catch (error: any) {
				// if (error.code == 'auth/account-exists-with-different-credential') {
				// 	alert('auth/account-exists-with-different-credential');
				// 	// Save Facebook credential.
				// 	// const facebookCred = error.credential;
				// 	// // If you already know there is an existing Google account.
				// 	// var googleProvider = new GoogleAuthProvider();
				// 	// // Login to the existing Google account with the same email.
				// 	// googleProvider.customOAuthParameters({'login_hint': error.email});
				// 	// return firebase.auth().signInWithPopup(googleProvider)
				// 	//    .then(function(result) {
				// 	// 	 // Link Facebook credential to Google account.
				// 	// 	 return result.user.linkWithCredential(facebookCred);
				// 	//    });
				// }
				setErrorMessage(error);
				setIsAuthenticating(false);
				alert(error);
			}
		} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
			promptAuthAsync();
		}
	};

	return [isAuthenticating, errorMessage, signInWithTwitter];
};

export default useTwitterAuth;
