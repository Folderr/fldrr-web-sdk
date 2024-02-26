export const httpCodes = {
	unauthorization: 401,
	forbidden: 403,
	notFound: 404,
	notAccepted: 406,
	created: 201,
	ok: 200,
};

export type BadResponseCodes = {
	notAccepted?: string;
	notFound?: string;
	forbidden?: string;
};

export type GenericFetchReturn<T = void> =
	| {
			error: string | Error;
			success: false;
			response?: Response;
			output: undefined;
	  }
	| { error: undefined; success: true; response?: Response; output?: T };