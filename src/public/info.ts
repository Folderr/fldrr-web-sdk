import { z } from "zod";
import { request } from "../helpers/request-handlers";
import { type GenericFetchReturn } from "../helpers/types-and-consts";
import * as consts from "./consts";

let { baseUrl } = consts;

export function setup(url?: string) {
	if (!url || url === "") {
		// Rule is expected to be relative
		return;
	}

	const _ = new URL(url);
	baseUrl = url + baseUrl;
}

const features = z.object({
	signups: z.number().int().lt(3),
	emailer: z.boolean(),
	// biome-ignore-start lint/style/useNamingConvention: From backend, based on http best practices
	dns_mirror: z.boolean(),
});
const apiMessage = z.object({
	version: z.string(),
	node_version: z.string(),
	online_since: z.number(),
	// biome-ignore-end lint/style/useNamingConvention: From backend
	message: z.string(),
	features,
});

export async function getApiInfo(): Promise<
	GenericFetchReturn<z.infer<typeof apiMessage> | string | undefined>
> {
	const resOut = z.object({
		message: apiMessage,
		code: z.number(),
	});

	return request(`${baseUrl}/`, "GET", resOut);
}
