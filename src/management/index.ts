import { setup as adminSetup, demoteAdmin, promoteUserToAdmin } from "./admin";

export const admin = {
	setup: adminSetup,
	demoteAdmin,
	promoteUserToAdmin,
};
