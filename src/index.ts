export * from "./helpers/types-and-consts";
export * from "./helpers/request-handlers";

import * as Manage from "./management/index";
import * as Admin from "./admin/index";
import * as Verification from "./verification/index";

export function setup(url?: string): {
	Manage: typeof Manage;
	Admin: typeof Admin;
	Verification: typeof Verification;
} {
	// We'll just assume this is relative
	if (url === "" || !url) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { Manage, Admin, Verification };
	}

	try {
		const _ = new URL(url);
		Manage.Admin.setup(url);
		Admin.Verifying.setup(url);
		Admin.User.setup(url);
		Admin.General.setup(url);
		Verification.Self.setup(url);
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { Manage, Admin, Verification };
	} catch (error) {
		throw Error("The URL you provided is invalid.");
	}
}
