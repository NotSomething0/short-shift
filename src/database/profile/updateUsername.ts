import { handlePostgrestError } from "$lib/supabase";
import { ActionError, type ActionAPIContext } from "astro:actions";
import { getProfile } from "./getProfile";

const UNIQUENESS_VIOLATION_CODE = "23505";

export async function updateUsername(
  context: ActionAPIContext,
  username: string,
) {
  const profile = await getProfile(context);

  if (profile.username === username) return username;

  const { data: available, error: checkUsernameError } =
    await context.locals.supabase.rpc("check_username_available", {
      check_username: username,
    });

  if (checkUsernameError) handlePostgrestError(checkUsernameError);

  if (!available)
    throw new ActionError({
      code: "CONFLICT",
      message: "This username is not available",
    });

  const { data, error } = await context.locals.supabase
    .from("profiles")
    .update({ username: username })
    .eq("user_id", profile.user_id)
    .select("username")
    .single();

  if (error?.code === UNIQUENESS_VIOLATION_CODE)
    throw new ActionError({
      code: "CONFLICT",
      message: "This username is not available",
    });

  if (error) handlePostgrestError(error);

  return data.username;
}
