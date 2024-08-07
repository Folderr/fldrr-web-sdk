import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";
import { request } from "../helpers/request-handlers";
import { z } from "zod";

let { baseUrl } = consts;

export function setup(url?: string) {
	if (!url || url === "") {
		// Rule is expected to be relative
		return;
	}

	const _ = new URL(url);
	baseUrl = url + baseUrl;
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
