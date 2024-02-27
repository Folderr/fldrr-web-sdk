export * from './helpers/types-and-consts';
export * from './helpers/request-handlers';

import * as Manage from './management/index';

export function setup(url?: string): { Manage: typeof Manage } {
    // we'll just assume this is relative
    if (url === '' || !url) {
        return { Manage: Manage }
    }

    try {
        new URL(url);
        Manage.Admin.setup(url)
        return { Manage: Manage };
    } catch (error) {
        throw new Error('The URL you provided is invalid.');
    }
}