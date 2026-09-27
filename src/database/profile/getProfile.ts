import { handleAuthError, handlePostgrestError } from "$lib/supabase";
import { ActionError, type ActionAPIContext } from "astro:actions";

export async function getProfile(context: ActionAPIContext) {
  const profile = await context.session?.get("profile");

  if (profile) return profile;

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

  const { data, error: profileError } = await context.locals.supabase
    .from("profiles")
    .select()
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (profileError) handlePostgrestError(profileError);

  context.session?.set("profile", data);

  return data;
}
