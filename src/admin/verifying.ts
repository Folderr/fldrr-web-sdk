/**
 * @fileoverview Handles all the stuff for Verifying Users
 */

import { z } from "zod";
import { request } from "../helpers/request-handlers";
import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";

export interface VerifyingUser {
	id: string;
	username: string;
	email: string;
	/** Unix time in milliseconds */
	createdAt: number;
}

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

export async function getVerfiyingUsers(): Promise<
	GenericFetchReturn<VerifyingUser[] | string | undefined>
> {
	const userOut = z.object({
		id: z.string(),
		username: z.string(),
		email: z.string(),
		createdAt: z.number(),
	});

	const resOut = z.object({
		code: z.number(),
		message: userOut.array(),
	});

	return request<VerifyingUser[], undefined>(
		`${baseUrl}/verifying-users`,
		"GET",
		resOut,
	);
}

export async function denyAccount(
	id: string,
): Promise<GenericFetchReturn<string | undefined>> {
	if (!id) {
		throw new Error("Missing required parameter: id");
	}
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return request<string, string>(`${baseUrl}/verify`, "DELETE", resOut, {
		body: {
			id,
		},
		badResCodes: {
			notFound: "Account not found",
		},
	});
}

export async function acceptAccount(
	id: string,
): Promise<GenericFetchReturn<string | undefined>> {
	if (!id) {
		throw new Error("Missing required parameter: id");
	}
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return request<string, string>(`${baseUrl}/verify`, "POST", resOut, {
		body: {
			id,
		},
		badResCodes: {
			notFound: "Account not found",
		},
	});
}
