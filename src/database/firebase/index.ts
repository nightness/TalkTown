// import * as Google from 'expo-google-app-auth';
import { FirebaseApp, FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import {
	AuthError, createUserWithEmailAndPassword,
	getAuth, GoogleAuthProvider, sendPasswordResetEmail,
	signInWithCustomToken,
	signInWithEmailAndPassword, signInWithRedirect, signOut, User as FirebaseUser
} from 'firebase/auth';
import {
	DocumentChange,
	DocumentData,
	DocumentSnapshot, getFirestore, QueryDocumentSnapshot, QuerySnapshot, serverTimestamp, Timestamp
} from 'firebase/firestore';
import * as FirebaseAuth from 'react-firebase-hooks/auth';
import * as FirebaseFirestore from 'react-firebase-hooks/firestore';
import { firebaseConfig } from '../FirebaseConfig';
import { FirebaseContext, FirebaseProvider } from './FirebaseContext';
import { Claims, GroupDocument, UserClaimsResponse, UserProfile } from './types';

let firebaseApp: FirebaseApp;
if (getApps().length === 0) {
	firebaseApp = initializeApp(firebaseConfig);
	console.log('Firebase initialized');
} else {
	firebaseApp = getApp();
}

// GoogleSignin.configure({
// 	iosClientId: '333769461160-rpiochl8sm6fhpln0q5sshu2ec84nbl0.apps.googleusercontent.com',
// 	// NOTE: This is actually the android client ID, that might be an issue, get webClientId from Robert
// 	webClientId: '333769461160-edmg5ua5hfvr8ilgs3peeas85lan0u8c.apps.googleusercontent.com',
// });

export {
	FirebaseContext,
	FirebaseProvider,
	getApp,
	getApps,
	createUserWithEmailAndPassword,
	signInWithRedirect,
	sendPasswordResetEmail,
	signInWithCustomToken,
	signInWithEmailAndPassword,
	signOut,
};
export type {
	AuthError,
	Claims,
	DocumentChange,
	DocumentData,
	DocumentSnapshot,
	FirebaseError,
	FirebaseUser,
	GroupDocument,
	QueryDocumentSnapshot,
	QuerySnapshot,
	Timestamp,
	UserClaimsResponse as UserClaims,
	UserProfile,
};
export { GoogleAuthProvider, getAuth, getFirestore };


export const androidClientId = '334341014853-s5d61fcm0lprsmnaehjasurhn8iq3ejr.apps.googleusercontent.com';
export const expoClientId = '334341014853-uf9jrn1gh3scc8n22f6hlhi0h4k6a6rs.apps.googleusercontent.com';
export const iosClientId = '334341014853-13psf2i5bu5fi03md6040fn62adjfvpr.apps.googleusercontent.com';
export const webClientId = '334341014853-8n0qc95472vgj6gfla636id20palfp63.apps.googleusercontent.com';

// https://tvpal-db.firebaseapp.com/__/auth/handler

export const clientIds = {
	androidClientId,
	expoClientId,
	iosClientId,
	webClientId,
};

// interface LoginSuccess {
// 	type: 'success';
// 	accessToken?: string;
// 	idToken?: string;
// 	refreshToken?: string;
// 	user: Google.GoogleUser;
// }

// if (Defaults.enableFirebasePersistence) {
// 	getFirestore()
// 		.enablePersistence()
// 		.then(() => {
// 			console.warn('Firestore Persistence Enabled!!!');
// 		})
// 		.catch((err: FirebaseError) => {
// 			// Not supported
// 			if (err.code === 'unimplemented') console.error('Firestore Persistence: unimplemented');

// 			// Open in another tab
// 			if (err.code === 'failed-precondition') console.error('Firestore Persistence: failed-precondition');
// 		});
// }

export const firebaseAuth = getAuth(getApp());


export const getCurrentTimeStamp = () => serverTimestamp();
export const getCurrentUser = () => firebaseAuth.currentUser;

export const useAuthState = () => FirebaseAuth.useAuthState(getAuth(getApp()));



// @ts-expect-error
export const getCollection = (collectionPath: string) => getFirestore(firebaseApp).collection(collectionPath);

export const useCollection = (collectionPath: string, includeMetadataChanges = false) =>
	!collectionPath
		? [undefined, false, new Error('useCollection: collectionPath not specified')]
		: FirebaseFirestore.useCollection(getCollection(collectionPath), {
				snapshotListenOptions: { includeMetadataChanges },
		  });

export const useCollectionOnce = (collectionPath: string, includeMetadataChanges = false) =>
	!collectionPath
		? [undefined, false, new Error('useCollectionOnce: collectionPath not specified')]
		: FirebaseFirestore.useCollectionOnce(getCollection(collectionPath));

export const useCollectionData = (collectionPath: string, includeMetadataChanges = false) =>
	!collectionPath
		? [undefined, false, new Error('useCollectionData: collectionPath not specified')]
		: FirebaseFirestore.useCollectionData(getCollection(collectionPath));

export const useCollectionDataOnce = (collectionPath: string, includeMetadataChanges = false) =>
	!collectionPath
		? [undefined, false, new Error('useCollectionDataOnce: collectionPath not specified')]
		: FirebaseFirestore.useCollectionDataOnce(getCollection(collectionPath));

// @ts-expect-error
export const getDocument = (documentPath: string) => getFirestore().doc(documentPath);

export const useDocument = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocument: documentPath was not specified')]
		: FirebaseFirestore.useDocument(getDocument(documentPath), {
				snapshotListenOptions: { includeMetadataChanges },
		  });

export const useDocumentOnce = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocumentOnce: documentPath was not specified')]
		: FirebaseFirestore.useDocumentOnce(getDocument(documentPath));

export const useDocumentData = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocumentData: documentPath was not specified')]
		: FirebaseFirestore.useDocumentData(getDocument(documentPath), {
				snapshotListenOptions: { includeMetadataChanges },
		  });

export const useDocumentDataOnce = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocument: documentPath was not specified')]
		: FirebaseFirestore.useDocumentDataOnce(getDocument(documentPath));

export const getData = (
	querySnapshot: QuerySnapshot<DocumentData>,
	orderBy?: string,
	length?: number,
	firstItem?: any
) => {
	// @ts-expect-error
	if (!orderBy) return querySnapshot.query.get();
	// @ts-expect-error
	else if (!length) return querySnapshot.query.orderBy(orderBy).get();
	// @ts-expect-error
	else if (!firstItem) return querySnapshot.query.orderBy(orderBy).limitToLast(length).get();
	// @ts-expect-error
	else return querySnapshot.query.orderBy(orderBy).limitToLast(length).startAt(firstItem).get();
};

export const getDocumentsDataWithId = (querySnapshot: QuerySnapshot<DocumentData>) => {
	let docs: DocumentData[] = [];
	querySnapshot.docs.forEach((doc: any) => {
		const data = doc.data();
		// Adds the doc's id to it's own data
		data.id = doc.id;
		docs.push(data);
	});
	return docs;
};

export const collectionContains = async (collection: string, docId: string) => {
	const firestore = getFirestore(firebaseApp);
	// @ts-expect-error
	return await firestore.collection(collection).doc('ABC').get();
};

// export async function signInWithGoogleAsync() {
// 	//logOutAsync({ accessToken, iosClientId, androidClientId, iosStandaloneAppClientId, androidStandaloneAppClientId }): Promise<any>

// 	if (Platform.OS === 'web') {
// 		// try {
// 		// 	const result = await Google.logInAsync({
// 		// 		behavior: 'web',
// 		// 		androidClientId,
// 		// 		iosClientId,
// 		// 		scopes: ['profile', 'email'],
// 		// 	});
// 		// 	if (result.type === 'success') {
// 		// 		const { idToken } = result as LoginSuccess;
// 		// 		let credential = GoogleAuthProvider.credential(idToken);
// 		// 		return signInWithCredential(firebaseAuth, credential);
// 		// 	}
// 		// } catch (error) {
// 		// 	console.error(error);
// 		// }
// 	} else {
// 		// // Get the users ID token
// 		// const { idToken } = await GoogleSignin.signIn();

// 		// // Create a Google credential with the token
// 		// const googleCredential = GoogleAuthProvider.credential(idToken);

// 		// // Sign-in the user with the credential
// 		// return signInWithCredential(firebaseAuth, googleCredential);
// 	}
// }
