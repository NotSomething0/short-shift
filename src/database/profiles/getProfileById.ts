import { handlePostgrestError } from "../../lib/supabase";
import type { ActionAPIContext } from "astro:actions";

export async function getProfileById(
  context: ActionAPIContext,
  user_id: string,
) {
  const { data, error } = await context.locals.supabase
    .from("profiles")
    .select()
    .eq("user_id", user_id)
    .limit(1)
    .single();

  if (error) handlePostgrestError(error);

  return data;
}
