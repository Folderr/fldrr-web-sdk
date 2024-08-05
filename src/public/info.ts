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

const features = z.object({
	signups: z.number().int().lt(3),
	emailer: z.boolean(),
	/*  eslint-disable @typescript-eslint/naming-convention */
	dns_mirror: z.boolean(),
});
const apiMessage = z.object({
	version: z.string(),
	node_version: z.string(),
	online_since: z.number(),
	/*  eslint-enable @typescript-eslint/naming-convention */
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
