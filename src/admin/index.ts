import {
	setup as verifyingSetup,
	getVerfiyingUsers,
	denyAccount,
	acceptAccount,
} from "./verifying";

import {
	setup as genSetup,
	type Statistics as GenStats,
	getStats,
	getBans,
} from "./general";

import {
	setup as userSetup,
	getUsers,
	deleteAccount,
	warnUser,
	banUser,
	unbanEmail,
	type User as UserType,
	type AdminUsersReturn as AdminUsersReturnType,
} from "./user";

export const verifying = {
	setup: verifyingSetup,
	denyAccount,
	acceptAccount,
	getVerfiyingUsers,
};

export const general = {
	setup: genSetup,
	getStats,
	getBans,
};

export const user = {
	setup: userSetup,
	getUsers,
	deleteAccount,
	warnUser,
	banUser,
	unbanEmail,
};

export type Statistics = GenStats;
export type User = UserType;
export type AdminUsersReturn = AdminUsersReturnType;
