import { handleAuthError, handlePostgrestError } from "$lib/supabase";
import { ActionError, type ActionAPIContext } from "astro:actions";

export async function getProfile(context: ActionAPIContext) {
  const {
    data: { user },
    error,
  } = await context.locals.supabase.auth.getUser();

  if (error) handleAuthError(error);

  if (!user)
    throw new ActionError({
      code: "UNAUTHORIZED",
      message: "You are not authorized to perform this action.",
    });

  const { data: profile, error: profileError } = await context.locals.supabase
    .from("profiles")
    .select()
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (profileError)
    handlePostgrestError(profileError);

  return profile;
}
