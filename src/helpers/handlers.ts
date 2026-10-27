import {
	type BadResponseCodes,
	type GenericFetchReturn,
	httpCodes,
} from "./types-and-consts";

function checkAuthenticationError(
	response: Response,
): GenericFetchReturn<undefined> | undefined {
	if (response.status === httpCodes.unauthorization) {
		return {
			error: "Authorization Failed",
			output: undefined,
			response,
			success: false,
		};
	}
	return undefined;
}

export function genericCatch<T>(error: unknown): GenericFetchReturn<T> {
	if (error instanceof Error) {
		if (error.message.includes("Authorization failed")) {
			return {
				error: "Authorization failed",
				success: false,
				output: undefined,
			};
		}

		return {
			error,
			success: false,
			output: undefined,
		};
	}

	return {
		error: "An unknown error occurred",
		success: false,
		output: undefined,
	};
}

export async function badResponseHandler(
	response: Response,
	codeMessage: BadResponseCodes,
): Promise<GenericFetchReturn<undefined> | undefined> {
	const check = checkAuthenticationError(response);
	if (check) {
		return check;
	}

	let json: { code: number; message: string } | undefined;
	try {
		json = await response.clone().json();
		if (!json?.code || !json?.message) {
			json = undefined;
		}
	} catch {
		json = undefined; // just in case
	}

	switch (
		response.status // Use a switch here as its typically faster, at least in compiled languages. Good practice.
	) {
		case httpCodes.badRequest:
			return {
				error:
					json?.message ??
					codeMessage.badRequest ??
					"Malformed / Invalid Request",
				success: false,
				response,
				output: undefined,
			};
		case httpCodes.notFound:
			return {
				error: json?.message ?? codeMessage.notFound ?? "Not found",
				success: false,
				response,
				output: undefined,
			};
		case httpCodes.forbidden:
			return {
				error:
					json?.message ??
					codeMessage.forbidden ??
					"You are not authorized to perform that action",
				success: false,
				output: undefined,
				response,
			};
		case httpCodes.notAccepted:
			return {
				error:
					json?.message ?? codeMessage.notAccepted ?? "Not Accepted",
				success: false,
				response,
				output: undefined,
			};
		case httpCodes.internalError:
			return {
				error:
					json?.message ??
					codeMessage.internalError ??
					"An internal server error occurred",
				success: false,
				output: undefined,
				response,
			};
		default:
	}

	if (!response.ok) {
		return {
			error:
				json?.message ??
				codeMessage.unexpected ??
				"An unexpected response was given",
			success: false,
			output: undefined,
			response,
		};
	}
}
