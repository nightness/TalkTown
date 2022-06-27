// These are the TypeScript types for the data structures in used Firestore

import {
	getFunctions,
	httpsCallable,
	HttpsCallable,
	HttpsCallableOptions,
} from 'firebase/functions';

export interface UserProfile extends HttpsCallableOptions {
	displayName?: string;
	theme?: any;
	photoURL?: any;
}

export interface GroupDocument {
	members?: [];
}

export type Claims = 'admin' | 'manager' | 'moderator';

export interface UserClaimsRequest extends HttpsCallableOptions {
	userId: string;
	authToken: string;
}

export interface UserClaimsResponse {
	admin: boolean;
	manager: boolean;
	moderator: boolean;
}

export type GetClaimsCallable = HttpsCallableOptions;
export const getClaimsCallable = async (userId: string, authToken: string) => {
	return httpsCallable<UserClaimsRequest, UserClaimsResponse>(
		getFunctions(),
		'getClaims',
		{
			userId,
			authToken,
		} as UserClaimsRequest
	);
};

export interface ModifyClaimRequest extends UserClaimsRequest {
	claim: Claims;
}

export interface ModifyClaimResponse {
	data: boolean;
}

export const addClaimCallable = async (
	userId: string,
	authToken: string,
	claim: Claims
) => {
	return httpsCallable<ModifyClaimRequest, ModifyClaimResponse>(
		getFunctions(),
		'modifyClaim',
		{
			userId,
			authToken,
			claim,
			value: true, // Add instead of remove
		} as ModifyClaimRequest
	);
};

export const removeClaimCallable = async (
	userId: string,
	authToken: string,
	claim: Claims
) => {
	return httpsCallable<ModifyClaimRequest, ModifyClaimResponse>(
		getFunctions(),
		'modifyClaim',
		{
			userId,
			authToken,
			claim,
		} as ModifyClaimRequest
	);
};

export interface SetProfileRequest extends HttpsCallableOptions {
	authToken: string;
	profile: UserProfile;
}

export const setProfileCallable = async (
	authToken: string,
	profile: UserProfile
) => {
	return httpsCallable<SetProfileRequest, ModifyClaimResponse>(
		getFunctions(),
		'setProfile',
		profile
	);
};

export interface ChangeGroupRequest extends HttpsCallableOptions {
	authToken: string;
	groupId: string;
}

export interface ChangeGroupResponse {
	type: string;
	message: string;
}

export const joinGroupCallable = async (
	authToken: string | undefined,
	groupId: string
) => {
	return httpsCallable<ChangeGroupRequest, ChangeGroupResponse>(
		getFunctions(),
		'joinGroup',
		{
			authToken,
			groupId,
		} as HttpsCallableOptions
	);
};

export const leaveGroupCallable = async (
	authToken: string | undefined,
	groupId: string
) => {
	return httpsCallable<ChangeGroupRequest, ChangeGroupResponse>(
		getFunctions(),
		'leaveGroup',
		{
			authToken,
			groupId,
		} as HttpsCallableOptions
	);
};