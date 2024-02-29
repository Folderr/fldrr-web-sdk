export * from "./helpers/types-and-consts";
export * from "./helpers/request-handlers";

import * as Manage from "./management/index";
import * as Admin from "./admin/index";

export function setup(url?: string): {
	Manage: typeof Manage;
	Admin: typeof Admin;
} {
	// We'll just assume this is relative
	if (url === "" || !url) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { Manage, Admin };
	}

	try {
		const _ = new URL(url);
		Manage.Admin.setup(url);
		Admin.Verifying.setup(url);
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { Manage, Admin };
	} catch (error) {
		throw Error("The URL you provided is invalid.");
	}
}
