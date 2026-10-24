import {
	type Statistics as GenStats,
	setup as genSetup,
	getBans,
	getStats,
} from "./general";
import {
	type AdminUsersReturn as AdminUsersReturnType,
	banUser,
	deleteAccount,
	getUsers,
	type User as UserType,
	unbanEmail,
	setup as userSetup,
	warnUser,
} from "./user";
import {
	acceptAccount,
	denyAccount,
	getVerfiyingUsers,
	setup as verifyingSetup,
} from "./verifying";

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
