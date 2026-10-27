export const httpCodes = {
	internalError: 500,
	unauthorization: 401,
	forbidden: 403,
	badRequest: 400,
	notFound: 404,
	notAccepted: 406,
	created: 201,
	ok: 200,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export const BASE_URL = "/api/";

export interface BadResponseCodes {
	notAccepted?: string;
	notFound?: string;
	forbidden?: string;
	badRequest?: string;
	internalError?: string;
	unexpected?: string;
}

export type GenericFetchReturn<T = void> =
	| {
			error: string | Error;
			success: false;
			response?: Response;
			output: undefined;
	  }
	| { error: undefined; success: true; response?: Response; output?: T };
