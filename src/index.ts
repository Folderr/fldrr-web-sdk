export * from "./helpers/types-and-consts";
export * from "./helpers/request-handlers";

import * as Manage from "./management/index";

export function setup(url?: string): { Manage: typeof Manage } {
  // We'll just assume this is relative
  if (url === "" || !url) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return { Manage };
  }

  try {
    const _ = new URL(url);
    Manage.Admin.setup(url);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return { Manage };
  } catch (error) {
    throw Error("The URL you provided is invalid.");
  }
}
