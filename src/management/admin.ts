import {z} from 'zod';
import * as constants from '../helpers/types-and-consts';
import * as localConstants from './consts';
import {request} from '../helpers/request-handlers';


/**
 * Promotes a user to admin
 * @param {string} id The ID of the user to promote to admin
 * @returns {constants.GenericFetchReturn<string | undefiend>}
 */
export async function promoteUserToAdmin(id: string): Promise<constants.GenericFetchReturn<string | undefined>> {
    const resOut = z.object({
        message: z.string(),
        code: z.number(),
    });
    return await request<string, undefined>(`${constants.BASE_URL}admin/${id}`, 'POST', resOut);
}

/**
 * Demotes an admin to a normal user
 * @param {string} id The ID of the admin to promote 
 * @returns 
 */
export async function demoteAdmin(id: string): Promise<constants.GenericFetchReturn<string | undefined>> {
    const resOut = z.object({
        message: z.string(),
        code: z.number(),
    });
    return await request<string, undefined>(`${constants.BASE_URL}admin/${id}`, 'DELETE', resOut);
}