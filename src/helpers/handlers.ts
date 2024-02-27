import {
  type BadResponseCodes,
  type GenericFetchReturn,
  httpCodes,
} from "./types-and-consts";

function checkAuthenticationError(
  response: Response,
): GenericFetchReturn<undefined> | undefined {
  switch (response.status) {
    case httpCodes.forbidden:
      return {
        error: "Access Denied",
        output: undefined,
        response,
        success: false,
      };
    case httpCodes.unauthorization:
      return {
        error: "Authorization Failed",
        output: undefined,
        response,
        success: false,
      };
    default:
      return undefined;
  }
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

  if (response.status === httpCodes.notFound) {
    return {
      error: codeMessage.notFound ?? "Endpoint Not Found",
      success: false,
      response,
      output: undefined,
    };
  }

  if (response.status === httpCodes.notAccepted) {
    return {
      error: codeMessage.notAccepted ?? "Not Accepted",
      success: false,
      response,
      output: undefined,
    };
  }

  if (response.status === httpCodes.forbidden) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json: { code: number; message: string } | undefined =
      await response.json();
    return {
      error:
        json?.message ??
        codeMessage.forbidden ??
        "You are not authorized to perform that action",
      success: false,
      output: undefined,
      response,
    };
  }
}
