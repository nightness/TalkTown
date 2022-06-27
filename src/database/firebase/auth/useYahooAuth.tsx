import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { Button, Platform } from 'react-native';

import { getAuth, FacebookAuthProvider, signInWithCredential, signInWithRedirect, OAuthProvider } from 'firebase/auth';
import { useEffect, useState } from 'react';
import useSignIn from './useSignIn';

const useProxy = Platform.select({ web: false, default: true });

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
	authorizationEndpoint: 'https://twitter.com/i/oauth2/authorize',
	tokenEndpoint: 'https://twitter.com/i/oauth2/token',
	revocationEndpoint: 'https://twitter.com/i/oauth2/revoke',
};

export default function useYahooAuth() {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();
	const webSignIn = useSignIn();

	const [request, response, promptAuthAsync] = useAuthRequest(
		{
			clientId: 'CLIENT_ID',
			redirectUri: makeRedirectUri({
				scheme: 'your.app',
				useProxy,
			}),
			usePKCE: true,
			scopes: ['tweet.read'],
		},
		discovery
	);

	// Logging... this is the request we send to the provider
	useEffect(() => {
		// console.log(`useYahooAuth: (request): ${JSON.stringify(request)}`);
	}, [request]);

	useEffect(() => {
		if (response?.type === 'success') {
			const { code } = response.params;
		}
	}, [response]);

	const signInWithYahoo = async () => {
		if (isAuthenticating) {
			console.log('useYahooAuth: Already authenticating a signIn');
			return;
		}
		setErrorMessage(undefined);
		setIsAuthenticating(true);
		if (Platform.OS === 'web') {
			try {
				const provider = new OAuthProvider('yahoo.com');
				provider.setCustomParameters({
					// Force re-consent.
					prompt: 'consent',
				});
				provider.addScope('profile');
				provider.addScope('email');

				const result = await webSignIn(getAuth(), provider);
				const credential = OAuthProvider.credentialFromResult(result);
				const accessToken = credential?.accessToken;
				const idToken = credential?.idToken;

				console.log('YAHOO: ', credential, accessToken, idToken);
			} catch (error: any) {
				// setSubmitted(false);
				alert(error);
			}
		} else if (Platform.OS === 'android' || Platform.OS === 'ios') {
			// promptGoogleAuthAsync();
		}
	};

	return [isAuthenticating, errorMessage, signInWithYahoo];
}
