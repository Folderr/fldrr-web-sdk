/**
 * @fileoverview Handles all the stuff for users
 */

import { z } from "zod";
import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";
import { request } from "../helpers/request-handlers";
import { BASE_URL } from "../helpers/types-and-consts";

let { baseUrl } = consts;
let baseDel = BASE_URL;

export function setup(url?: string) {
	if (!url || url === "") {
		// Rule is expected to be relative
		return;
	}

	const _ = new URL(url);
	baseUrl = url + baseUrl;
	baseDel = url + baseDel;
}

export type User = {
	id: string;
	email: string;
	username: string;
	files: number;
	links: number;
	createdAt: Date;
	cURLs: string[];
	markedForDeletion: boolean;
	admin: boolean;
	owner: boolean;
}

export type AdminUsersReturn = {
	title: string;
	links: number;
	files: number;
	id: string;
	email: string;
	username: string;
	createdAt: number;
};

export async function getUsers(): Promise<GenericFetchReturn<AdminUsersReturn | string | undefined>> {
	const userSchema = z.object({
		id: z.string(),
		email: z.string(),
		username: z.string(),
		files: z.number(),
		links: z.number(),
		title: z.string(),
		createdAt: z.number(),
	})

	const resOut = z.object({
		code: z.number(),
		message: userSchema
	});

	// 1054: DB Entry/Entries Not Found

	return await request(`${baseUrl}users`, "GET", resOut, {
		alts: {
			1054: "Users Not Found",
		},
		badResCodes: {
			notFound: "Users Not Found",
		}
	})
}

export async function deleteAccount(id: string, reason: string): Promise<GenericFetchReturn<string | undefined>> {
	if (!id || !reason) {
		throw Error("Missing parameter(s). Need both an id and a reason");
	}
	
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return await request(`${baseDel}/account?userid=${id}`, "DELETE", resOut, {
		body: {
			reason,
		},
		badResCodes: {
			notFound: "User Not Found",
			forbidden: "You can't delete that account (forbidden)",
			notAccepted: "Account not deleted"
		}
	});
}

export async function warnUser(id: string, reason: string): Promise<GenericFetchReturn<string | undefined>> {
	if (!id || !reason) {
		throw Error("Missing parameter(s). Need both an id and a reason");
	}
	
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return await request(`${baseUrl}warn/${id}`, "POST", resOut, {
		body: {
			reason,
		},
		badResCodes: {
			notFound: "User Not Found",
			notAccepted: "Warn Failed"
		}
	});
}

export async function banUser(id: string, reason: string): Promise<GenericFetchReturn<string | undefined>> {
	if (!id || !reason) {
		throw Error("Missing parameter(s). Need both an id and a reason");
	}
	
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return await request(`${baseUrl}ban/${id}`, "POST", resOut, {
		body: {
			reason,
		},
		badResCodes: {
			notFound: "User Not Found",
			notAccepted: "Ban Failed",
			forbidden: "You can't ban that account (forbidden)"
		}
	});
}

export type Ban = {
	id: string;
	email: string;
	createdAt: string;
	reason: string;
}

export async function unbanEmail(id: string, reason: string): Promise<GenericFetchReturn<string | undefined>> {
	if (!id || !reason) {
		throw Error("Missing parameter(s). Need both an id and a reason");
	}
	
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return await request(`${baseUrl}ban/${id}`, "POST", resOut, {
		body: {
			reason,
		},
		badResCodes: {
			notFound: "Ban Not Found",
			notAccepted: "Unban Failed",
			forbidden: "You can't unban that account (forbidden)"
		}
	});
}
