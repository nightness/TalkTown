import React, { createContext, useState, useEffect, useContext } from 'react';
import {
	ActivityIndicator,
	DisplayError,
	ScreenContext,
	Theme,
} from '@components';
import {
	addClaimCallable,
	Claims,
	getClaimsCallable,
	joinGroupCallable,
	ChangeGroupRequest,
	removeClaimCallable,
	setProfileCallable,
	UserClaimsResponse,
} from './types';
import { getCollection, useAuthState } from '.';

import { getAuth, updateProfile, User } from 'firebase/auth';

import { httpsCallable, getFunctions } from 'firebase/functions';

import { Styles } from '@app/Styles';
import { GlobalContext } from '@app/GlobalContext';
import FirebaseNotifications from './FirebaseNotifications';
import { string } from 'prop-types';

export interface SettableProfile {
	displayName?: string;
	theme?: 'Light' | 'Dark';
	photoURL?: string;
}

type ContextType = {
	currentUser?: User | null;
	claims?: UserClaimsResponse;
	isLoading: boolean;
	error?: any;
	authToken?: string;
	addClaim: (uid: string, claimName: Claims) => Promise<any>;
	removeClaim: (uid: string, claimName: Claims) => Promise<any>;
	getClaims: (uid: string) => Promise<any>;
	setProfile: (profile: SettableProfile) => Promise<any>;
	joinGroup: (groupId: string) => Promise<any>;
};

export const FirebaseContext = createContext<ContextType>({
	isLoading: true,
	addClaim: (uid: string, claimName: string) => new Promise(() => undefined),
	removeClaim: (uid: string, claimName: string) => new Promise(() => undefined),
	getClaims: (uid: string) => new Promise(() => undefined),
	setProfile: (profile: SettableProfile) => new Promise(() => undefined),
	joinGroup: (groupId: string) => new Promise(() => undefined),
});

interface Props {
	children: JSX.Element | JSX.Element[];
}

export const FirebaseProvider = ({ children }: Props) => {
	const { activeTheme, setActiveTheme } = useContext(ScreenContext);
	const [currentUser, loadingUser, errorUser] = useAuthState();
	const [claims, setClaims] = useState<UserClaimsResponse>();
	const [loadingClaims, setLoadingClaims] = useState(true);
	const [loadingTheme, setLoadingTheme] = useState(true);
	const [authToken, setAuthToken] = useState<string>();
	const { showToast } = useContext(GlobalContext);
	// Setter here is being used to prevent an async race condition with component state
	const [savingTheme, setSavingTheme] = useState(false);

	// User requires the .admin token to use this function
	const getClaims = async (uid: string) => {
		if (!authToken || !currentUser) return;
		const callable = await getClaimsCallable(uid, authToken);
		const userClaims = callable();
		return userClaims;
	};

	// User requires the .admin token to use this function
	const addClaim = async (uid: string, claimName: Claims) => {
		if (!authToken || !currentUser) return;
		const callable = await addClaimCallable(uid, authToken, claimName);
		const results = await callable();
		return results.data.data;
	};

	// User requires the .admin token to use this function
	const removeClaim = async (uid: string, claimName: Claims) => {
		if (!authToken) return;
		const callable = await removeClaimCallable(uid, authToken, claimName);
		const results = await callable();
		return results.data;
	};

	const updateUserToken = async () => {
		if (!currentUser) {
			setAuthToken(undefined);
			return;
		}

		const token: any = await currentUser.getIdToken(true);
		setAuthToken(token);
		console.log(token);

		const { claims } = await currentUser.getIdTokenResult();
		console.log(claims);

        console.log("CLAIMS: ", claims)

		setClaims(claims);
		setLoadingClaims(false);
	};

	// Because of ContextType, displayName is required when being called non-locally
	const setProfile = async ({
		displayName,
		photoURL,
		theme,
	}: SettableProfile) => {
		const currentUser = getAuth().currentUser;
		if (!currentUser) return;
		if (!displayName) displayName = currentUser.displayName as string;
		const authToken = await currentUser.getIdToken();
		setSavingTheme(true);

		const callable = await setProfileCallable(authToken, {
			displayName,
			theme,
			photoURL,
		});
		const promises: Promise<any>[] = [];
		promises.push(updateProfile(currentUser, { displayName }));
		promises.push(callable());
		setSavingTheme(false);
		return Promise.all(promises);
	};

	// Save the current user's theme when it changes
	const getCurrentUsersTheme = async (uid: string) => {
		const snapshot = await getCollection('profiles').doc(uid).get();
		const data = snapshot.data();
		if (data) return data.theme as Theme;
		return 'Light' as Theme;
	};

	const joinGroup = async (groupId: string) => {
		if (!authToken) return;
		const callable = await joinGroupCallable(authToken, {
			groupId,
		} as ChangeGroupRequest);
		const results = await callable();
		return results.data;
	};

	useEffect(() => {
        if (!currentUser) {
            setActiveTheme('Light');
            return;
        }
		updateUserToken();
		setLoadingClaims(true);
		if (setClaims)
			getClaims(currentUser?.uid).then((claims) => setClaims(claims?.data));
		// if (currentUser) {
		//     getCurrentUsersTheme(currentUser.uid).then((usersTheme: Theme) => {
		//         if (usersTheme && usersTheme != activeTheme)
		//             setActiveTheme(usersTheme)
		//         setLoadingTheme(false)
		//     }).catch((error) => {
		//         console.error(error)
		//         setLoadingTheme(false)
		//     })
		// }
	}, [currentUser]);

	// useEffect(() => {
	//     if (currentUser && !savingTheme) {
	//         getCurrentUsersTheme(currentUser.uid).then((usersTheme: Theme) => {
	//             if (usersTheme && usersTheme != activeTheme)
	//                 setProfile({ theme: usersTheme })
	//         }).catch(() => {
	//             setSavingTheme(false)
	//         })
	//     }
	// }, [activeTheme])

	const isLoading = loadingUser || loadingClaims || loadingTheme;
	const error = errorUser;

	if (loadingUser) return <ActivityIndicator fullscreen={true} />;
	else if (errorUser)
		return (
			<DisplayError permissionDenied={errorUser.code === 'permission-denied'} />
		);
	return (
		<>
			{/* <FirebaseNotifications currentUser={currentUser} /> */}
			<FirebaseContext.Provider
				value={{
					currentUser,
					claims,
					isLoading,
					error,
					addClaim,
					removeClaim,
					getClaims,
					setProfile,
					joinGroup,
					authToken,
				}}
			>
				{children}
			</FirebaseContext.Provider>
		</>
	);
};
