import { z } from "zod";
import { request } from "../helpers/request-handlers";
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

type ListQuery =
	| {
			limit: string;
			gallery: "true" | "false";
			before: string;
			after?: string;
	  }
	| {
			limit: string;
			gallery: "true" | "false";
			before?: string;
			after: string;
	  };

const uploadSchema = z.object({
	id: z.string(),
	type: z.string(),
	created: z.string(),
	link: z.string(),
});

const uploadListSchema = z.array(uploadSchema);

const uploadListOutput = z.object({
	code: z.number(),
	message: uploadListSchema,
});

export async function getUploadList(
	options: { before?: Date; after: Date } | { before: Date; after?: Date },
) {
	if (!options || (!options.before && !options.after)) {
		throw new Error("You must provide either a before or after date");
	}

	let query: ListQuery;
	if (options.before) {
		query = {
			limit: "30",
			gallery: "false",
			before: options.before.toISOString(),
		};

		if (options.after) {
			query.after = options.after.toISOString();
		}

		return request(baseUrl + "/files", "GET", uploadListOutput, {
			query,
		});
	}

	if (options.after) {
		query = {
			limit: "30",
			gallery: "false",
			after: options.after.toISOString(),
		};

		return request(baseUrl + "/files", "GET", uploadListOutput, {
			query,
		});
	}
}

const linkSchema = z.object({
	id: z.string(),
	link: z.string(),
	created: z.string(),
	// biome-ignore lint/style/useNamingConvention: Using web & backend naming convention
	points_to: z.string(),
});

const linkListSchema = z.array(linkSchema);
const linkListOutput = z.object({
	code: z.number(),
	message: linkListSchema,
});
export async function getLinkList(
	options: { before?: Date; after: Date } | { before: Date; after?: Date },
) {
	if (!options || (!options.before && !options.after)) {
		throw new Error("You must provide either a before or after date");
	}

	let query: ListQuery;
	if (options.before) {
		query = {
			limit: "30",
			gallery: "false",
			before: options.before.toISOString(),
		};

		if (options.after) {
			query.after = options.after.toISOString();
		}

		return request(baseUrl + "/links", "GET", linkListOutput, {
			query,
		});
	}

	if (options.after) {
		query = {
			limit: "30",
			gallery: "false",
			after: options.after.toISOString(),
		};

		return request(baseUrl + "/links", "GET", linkListOutput, {
			query,
		});
	}
}
