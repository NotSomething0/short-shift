import type { AuthError, PostgrestError } from "@supabase/supabase-js";
import { ActionError } from "astro:actions";

export function handleAuthError(error: AuthError): never {
  switch (error.code) {
    case "weak_password":
      throw new ActionError({
        code: "UNPROCESSABLE_CONTENT",
        message: error.message,
      });
    case "invalid_credentials":
      throw new ActionError({
        code: "UNAUTHORIZED",
        message: "Invalid login credentials",
      });
    case "over_email_send_rate_limit":
      throw new ActionError({
        code: "TOO_MANY_REQUESTS",
        message: "Reset email already sent. Please wait before retrying.",
      });
    default:
      console.log(
        "An error occured while handling auth related shit that we don't handle directly",
      );
      console.log(error);
      throw new ActionError({
        code: "UNPROCESSABLE_CONTENT",
        message: error.message,
      });
  }
}

export function handlePostgrestError(error: PostgrestError): never {
  switch (error.code) {
    default:
      console.error(
        "A PostgrestError has occured that we don't handle yet",
        error,
      );
      throw new ActionError({ code: "INTERNAL_SERVER_ERROR" });
  }
}
