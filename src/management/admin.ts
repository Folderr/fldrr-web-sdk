import {z} from 'zod';
import * as constants from '../helpers/types-and-consts';
import * as localConstants from './consts';
import {request} from '../helpers/request-handlers';

let BASE_URL = '';

export function setup(url: string) {
    if (url === '') return;
    // let's just check if this is a url
    new URL(url);
    BASE_URL = url;
}

/**
 * Promotes a user to admin
 * @param {string} id The ID of the user to promote to admin
 * @returns {constants.GenericFetchReturn<string | undefiend>}
 */
export async function promoteUserToAdmin(id: string): Promise<constants.GenericFetchReturn<string | undefined>> {
    if (!id) throw new Error('Missing parameter "id"')
    const resOut = z.object({
        message: z.string(),
        code: z.number(),
    });
    return await request<string, undefined>(`${BASE_URL}${constants.BASE_URL}admin/${id}`, 'POST', resOut);
}

/**
 * Demotes an admin to a normal user
 * @param {string} id The ID of the admin to promote 
 * @param {string} reason The reason this admin is being demoted.
 * @returns 
 */
export async function demoteAdmin(id: string, reason: string): Promise<constants.GenericFetchReturn<string | undefined>> {
    // For safety's sake, we're a library. If these don't exist, we'll error.
    const missing = [];
    if (!id) missing.push('id');
    if (!reason) missing.push('reason');
    if (missing.length > 0) throw new Error(`Missing parameters ${missing.join(', ')}`);

    const resOut = z.object({
        message: z.string(),
        code: z.number(),
    });
    return await request<string, undefined>(`${BASE_URL}${constants.BASE_URL}admin/${id}`, 'DELETE', resOut, {
        body: {
            reason: z.string().parse(reason),
        }
    });
}