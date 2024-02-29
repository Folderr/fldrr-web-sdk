import { ZodSchema, type z } from "zod";
import {
	type BadResponseCodes,
	type GenericFetchReturn,
} from "./types-and-consts";
import { badResponseHandler, genericCatch } from "./handlers";

/**
 *
 * @param {string} url The url to query
 * @param {string} method What method you intend on using for this request.
 * @param {ZodSchema} output The Zod schema output you expect
 * @param [options] Optional things
 * @param {ZodSchema} [options.body] JSON for the request. Set's Content-Type to application/json.
 * @param {Record<string, string>} [options.header] any headers you want to supply
 * @param {BadResponseCodes} [options.badResCodes] An object of HTTP error codes and responses.
 * @param {Record<number, string>} [options.alts] An object of numbers and their response.
 * @param {number[]} [options.okCodes] A set of htp codes to be considered "OK"
 * @returns {Promise<GenericFetchReturn<any>>}
 */
export async function request<Tresponse, Tbody>(
	url: string,
	method: "POST" | "PATCH" | "PUT" | "GET" | "DELETE",
	output: z.Schema<{ code: number; message: Tresponse }>,
	options?: {
		body?: Record<string, Tbody | string>;
		headers?: Record<string, string>;
		badResCodes?: BadResponseCodes;
		alts?: Record<number, string>;
		okCodes?: number[];
	},
): Promise<GenericFetchReturn<Tresponse | string | undefined>> {
	// Verify the shape of the response schema. Must match "{ code: number, message: unknown }"
	let headers: Record<string, string> | undefined = options?.headers;

	if (options?.body && typeof headers !== "undefined") {
		headers["content-type"] = "application/json";
	} else if (options?.body && typeof headers === "undefined") {
		headers = { "content-type": "application/json" };
	}

	try {
		const response = await fetch(url, {
			headers,
			body: options?.body && JSON.stringify(options?.body),
			method,
			credentials: "same-origin",
		});

		const check = await badResponseHandler(
			response,
			options?.badResCodes ?? {},
		);

		if (check) {
			return check;
		}

		const json = output.parse(await response.json());
		if (options?.alts && json.code in options.alts) {
			return {
				success: true,
				output: options.alts[json.code],
				error: undefined,
				response,
			};
		}

		// Everything should in theory be good?
		return {
			success: true,
			output: json.message,
			error: undefined,
			response,
		};
	} catch (error: unknown) {
		return genericCatch<undefined>(error);
	}
}
