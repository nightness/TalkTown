// import * as Google from 'expo-google-app-auth';
import { FirebaseApp, FirebaseError, getApp, getApps, initializeApp } from 'firebase/app';
import {
	AuthError, createUserWithEmailAndPassword,
	getAuth, GoogleAuthProvider, sendPasswordResetEmail,
	signInWithCustomToken,
	signInWithEmailAndPassword, signInWithRedirect, signOut, User as FirebaseUser
} from 'firebase/auth';
import {
	collection, doc, getDoc,
	query,
	CollectionReference, DocumentReference,
	DocumentChange,
	DocumentData,
	DocumentSnapshot, getFirestore, QueryDocumentSnapshot, QuerySnapshot, serverTimestamp, Timestamp, orderBy, limitToLast, startAt, QueryConstraint, getDocs, Query
} from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
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

import { androidClientId, expoClientId, iosClientId, webClientId } from '../../../private/FirebaseAuth';

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

export const getCollection = (collectionPath: string) => collection(getFirestore(), collectionPath);

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

export const getDocument = async (documentPath: string) => {
	return await getDoc(doc(getFirestore(), documentPath))
}

export const useDocument = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocument: documentPath was not specified')]
		: FirebaseFirestore.useDocument(doc(getFirestore(), documentPath), {
				snapshotListenOptions: { includeMetadataChanges },
		  });

export const useDocumentOnce = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocumentOnce: documentPath was not specified')]
		: FirebaseFirestore.useDocumentOnce(doc(getFirestore(), documentPath));

export const useDocumentData = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocumentData: documentPath was not specified')]
		: FirebaseFirestore.useDocumentData(doc(getFirestore(), documentPath), {
				snapshotListenOptions: { includeMetadataChanges },
		  });

export const useDocumentDataOnce = (documentPath: string, includeMetadataChanges = false) =>
	!documentPath
		? [undefined, false, new Error('useDocument: documentPath was not specified')]
		: FirebaseFirestore.useDocumentDataOnce(doc(getFirestore(), documentPath));

export const getData = (
	queryDocumentData: Query,
	order?: string,
	length?: number,
	firstItem?: any
) => {
	const constraints = [] as QueryConstraint[]
	if (order) constraints.push(orderBy(order))
	if (length) constraints.push(limitToLast(length))
	if (firstItem) constraints.push(startAt(firstItem))
	
	const docsQuery = query(queryDocumentData, ...constraints);
	return getDocs(docsQuery);
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

export const collectionContains = async (collectionName: string, docId: string) => {		
	return (await getDoc(doc(getFirestore(), collectionName))).exists
};

export const callFirebaseFunction = async (
	functionName: string,
	data: any,
) => {
	return httpsCallable(getFunctions(), functionName, data);
}
