// biome-ignore-all lint/style/useNamingConvention: These are styled as modules
export * from "./helpers/request-handlers";
export * from "./helpers/types-and-consts";

import * as Admin from "./admin/index";
import * as Manage from "./management/index";
import * as Public from "./public/index";
import * as User from "./user/index";
import * as Verification from "./verification/index";

export type { AdminUsersReturn, Statistics, User } from "./admin/index";

export function setup(url?: string): {
	Manage: { admin: typeof Manage.admin };
	Admin: {
		user: typeof Admin.user;
		verifying: typeof Admin.verifying;
		general: typeof Admin.general;
	};
	Verification: { self: typeof Verification.self };
	Public: { info: typeof Public.info };
	User: { lists: typeof User.lists };
} {
	// We'll just assume this is relative
	if (url === "" || !url) {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { Manage, Admin, Verification, Public, User };
	}

	try {
		const _ = new URL(url);
		Manage.admin.setup(url);
		Admin.verifying.setup(url);
		Admin.user.setup(url);
		Admin.general.setup(url);
		Verification.self.setup(url);
		Public.info.setup(url);
		User.lists.setup(url);
		// eslint-disable-next-line @typescript-eslint/naming-convention
		return { Manage, Admin, Verification, Public, User };
	} catch (error) {
		throw new Error("The URL you provided is invalid.", { cause: error });
	}
}
