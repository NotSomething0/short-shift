import { handlePostgrestError } from "$lib/supabase";
import type { ActionAPIContext } from "astro:actions";
import { getProfile } from "./getProfile";

export async function getFollowedSeries(context: ActionAPIContext) {
  const profile = await getProfile(context);
  const { data, error } = await context.locals.supabase
    .from("profile_followed_series")
    .select("series_id")
    .eq("user_id", profile.user_id);

  if (error) handlePostgrestError(error);

  return data.map((row) => row.series_id);
}
