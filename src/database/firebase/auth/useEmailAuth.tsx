import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const useEmailAuth = () => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string>();

	const signInWithEmail = (username: string, password: string) => {
		if (isAuthenticating) {
			console.log('useGoogleAuth: Already authenticating a signIn')
			return;
		}
		setErrorMessage(undefined);
		setIsAuthenticating(true);
        signInWithEmailAndPassword(getAuth(), username, password).catch((error) => {
            setErrorMessage(error);
        }).finally(() => {
            setIsAuthenticating(false);
        })
	};

	return [isAuthenticating, errorMessage, signInWithEmail];
};

export default useEmailAuth;
