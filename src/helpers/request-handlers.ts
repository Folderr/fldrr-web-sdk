import {z} from 'zod';
import { BadResponseCodes, GenericFetchReturn } from './types-and-consts';
import { badResponseHandler, genericCatch } from './handlers';

export async function request<
        TResponseSchema extends z.Schema,
        TBodySchema extends z.Schema<{ code: number; message: TResponseSchema }>,
        TBody
    >(url: string, method: "POST" | "PATCH" | "PUT" | "GET" | "DELETE", output: TBodySchema, options?: {
        body?: Record<string, TBody | string>,
        headers?: Record<string, string>,
        badResCodes?: BadResponseCodes,
        alts?: Record<number, string>,
    }
): Promise<GenericFetchReturn<TResponseSchema | string | undefined>> {
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