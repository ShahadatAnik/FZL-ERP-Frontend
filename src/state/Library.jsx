import createGlobalState from '.';
import { libraryQK } from './QueryKeys';
// * User * //
export const useLibraryUser = () =>
	createGlobalState({
		queryKey: libraryQK.users(),
		url: '/hr/user-common',
	});
export const useLibraryUserByUUID = (uuid) =>
	createGlobalState({
		queryKey: libraryQK.user(uuid),
		url: `/hr/user-common${uuid}`,
	});
// * Policy * //
export const useLibraryPolicy = () =>
	createGlobalState({
		queryKey: libraryQK.policies(),
		url: '/hr/policy-and-notice',
	});
export const useLibraryPolicyByUUID = (uuid) =>
	createGlobalState({
		queryKey: libraryQK.policy(uuid),
		url: `/hr/policy-and-notice${uuid}`,
	});
