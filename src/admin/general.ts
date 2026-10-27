/**
 * @fileoverview Handles all the stuff for Verifying Users
 */

import { z } from "zod";
import { request } from "../helpers/request-handlers";
import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";
import { type Ban } from "./user";

let { baseUrl } = consts;

export function setup(url?: string) {
	if (!url) {
		// Rule is expected to be relative
		return;
	}

	if (url.endsWith("/")) {
		url = url.slice(0, url.length - 1);
	}

	const _ = new URL(url);
	baseUrl = url + consts.baseUrl;
}

export interface Statistics {
	users: number;
	links: number;
	files: number;
	bannedEmails: number;
	whitelistedEmails: number;
}

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

	return request(`${baseUrl}/statistics`, "GET", resOut);
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

	return request(`${baseUrl}/bans`, "GET", resOut);
}
