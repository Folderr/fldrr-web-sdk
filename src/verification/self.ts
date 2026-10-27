import { z } from "zod";
import { request } from "../helpers/request-handlers";
import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";

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

export async function verifySelf(
	userid: string,
	token: string,
): Promise<GenericFetchReturn<string | boolean | undefined>> {
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return request(`${baseUrl}/verify/${userid}/${token}`, "POST", resOut, {
		badResCodes: {
			badRequest: "Invalid ID or Verification Token",
			notFound: "User not found or invalid verification details",
		},
	});
}

export async function denySelf(
	userid: string,
	token: string,
): Promise<GenericFetchReturn<string | boolean | undefined>> {
	const resOut = z.object({
		message: z.string(),
		code: z.number(),
	});

	return request(`${baseUrl}/verify/${userid}/${token}`, "DELETE", resOut);
}
