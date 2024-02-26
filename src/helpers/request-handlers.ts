import {ZodSchema, z} from 'zod';
import { BadResponseCodes, GenericFetchReturn } from './types-and-consts';
import { badResponseHandler, genericCatch } from './handlers';

/**
 * 
 * @param {string} url The url to query
 * @param {"POST" | "PATCH" | "PUT" | "GET" | "DELETE"} method What method you intend on using for this request. 
 * @param {ZodSchema} output The Zod schema output you expect
 * @param [options] Optional things
 * @param {ZodSchema} [options.body] A JSON body to supply to the request. Set's content-type header to application/json.
 * @param {Record<string, string>} [options.header] any headers you want to supply
 * @param {BadResponseCodes} [options.badResCodes] An object of HTTP error codes and their associated responses.
 * @param {Record<number, string>} [options.alts] An object of numbers and their pre-programmed response. These numbers are listed in Folderr's source code.
 * @param {number[]} [options.okCodes] A set of htp codes to be considered "OK"
 * @returns {Promise<GenericFetchReturn<any>>}
 */
export async function request<
        TResponse,
        TBody
    >(url: string, method: "POST" | "PATCH" | "PUT" | "GET" | "DELETE", output: z.Schema<{ code: number; message: TResponse }>, options?: {
        body?: Record<string, TBody | string>,
        headers?: Record<string, string>,
        badResCodes?: BadResponseCodes,
        alts?: Record<number, string>,
        okCodes?: number[];
    }
): Promise<GenericFetchReturn<TResponse | string | undefined>> {
    // verify the shape of the response schema. Must match "{ code: number, message: unknown }"
    let headers: Record<string, string> | undefined = options?.headers;

    if (options?.body && typeof headers != 'undefined') {
        headers['content-type'] = 'application/json'
    } else if (options?.body && typeof headers == 'undefined') {
        headers = {'content-type': 'application/json'}
    }

    try {
        const response = await fetch(url, {
            headers,
            body: options?.body && JSON.stringify(options?.body),
            method,
            credentials: "same-origin"
        })

        const check = await badResponseHandler(response, options?.badResCodes ?? {})

        if (check) {
            return check;
        }

        const json = output.parse(await response.json);
        if (options?.alts && Object.keys(options.alts).includes(String(json.code))) {
            return {
                success: true,
                output: options.alts[json.code],
                error: undefined,
                response,
            }
        }

        // everything should in theory be good?
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