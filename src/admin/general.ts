/**
 * @fileoverview Handles all the stuff for Verifying Users
 */

import { z } from "zod";
import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";
import { type Ban } from "./user";
import { request } from "../helpers/request-handlers";

let { baseUrl } = consts;

export function setup(url?: string) {
	if (!url || url === "") {
		// Rule is expected to be relative
		return;
	}

	const _ = new URL(url);
	baseUrl = url + baseUrl;
}

export type Statistics = {
	users: number;
	links: number;
	files: number;
	bannedEmails: number;
	whitelistedEmails: number;
};

export async function getStats(): Promise<
	GenericFetchReturn<Statistics | string | undefined>
> {
	const stats = z.object({
		users: z.number(),
		links: z.number(),
		files: z.number(),
		bannedEmails: z.number(),
		whitelistedEmails: z.number(),
	});

	const resOut = z.object({
		message: stats,
		code: z.number(),
	});

	return request(`${baseUrl}statistics`, "GET", resOut);
}

export async function getBans(): Promise<
	GenericFetchReturn<Ban[] | string | undefined>
> {
	const ban = z.object({
		id: z.string(),
		reason: z.string(),
		email: z.string(),
		createdAt: z.number(),
	});

	const resOut = z.object({
		message: ban.array(),
		code: z.number(),
	});

	return request(`${baseUrl}bans`, "GET", resOut);
}
