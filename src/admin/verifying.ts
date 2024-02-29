/**
 * @fileoverview Handles all the stuff for Verifying Users
 */

import { z } from "zod";
import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";
import { request } from "../helpers/request-handlers";

export type VerifyingUser = {
	id: string;
	username: string;
	email: string;
	createdAt: Date;
};

let { baseUrl } = consts;

export function setup(url?: string) {
	if (!url || url === "") {
		// Rule is expected to be relative
		return;
	}

	const _ = new URL(url);
	baseUrl = url + baseUrl;
}

export async function getVerfiyingUsers(): Promise<
	GenericFetchReturn<VerifyingUser[] | string | undefined>
> {
	const userOut = z.object({
		id: z.string(),
		username: z.string(),
		email: z.string(),
		createdAt: z.date(),
	});

	const resOut = z.object({
		code: z.number(),
		message: userOut.array(),
	});

	return request<VerifyingUser[], undefined>(
		`${baseUrl}verifying-users`,
		"GET",
		resOut,
	);
}

export async function denyAccount(
	id: string,
): Promise<GenericFetchReturn<string | undefined>> {
	if (!id) throw new Error("Missing required parameter: id");
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return request<string, string>(`${baseUrl}verify`, "DELETE", resOut, {
		body: {
			id,
		},
	});
}

export async function acceptAccount(
	id: string,
): Promise<GenericFetchReturn<string | undefined>> {
	if (!id) throw new Error("Missing required parameter: id");
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return request<string, string>(`${baseUrl}verify`, "POST", resOut, {
		body: {
			id,
		},
	});
}
