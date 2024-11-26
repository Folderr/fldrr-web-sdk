import { BASE_URL } from "./consts";
import { z } from "zod";
import { request } from "../helpers/request-handlers";

let baseUrl = BASE_URL;
export function setup(url?: string) {
	if (!url || url === "") {
		// Rule is expected to be relative
		return;
	}

	const _ = new URL(url);
	baseUrl = url + baseUrl;
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

		return request(baseUrl + "/links", "GET", uploadListOutput, {
			query,
		});
	}

	if (options.after) {
		query = {
			limit: "30",
			gallery: "false",
			after: options.after.toISOString(),
		};

		return request(baseUrl + "/links", "GET", uploadListOutput, {
			query,
		});
	}
}

const linkSchema = z.object({
	id: z.string(),
	link: z.string(),
	created: z.string(),
	// eslint-disable-next-line @typescript-eslint/naming-convention
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

		return request(BASE_URL + "/links", "GET", linkListOutput, {
			query,
		});
	}

	if (options.after) {
		query = {
			limit: "30",
			gallery: "false",
			after: options.after.toISOString(),
		};

		return request(BASE_URL + "/links", "GET", linkListOutput, {
			query,
		});
	}
}
