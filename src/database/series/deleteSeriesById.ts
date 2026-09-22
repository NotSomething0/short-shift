import { type ActionAPIContext } from "astro:actions";
import { handlePostgrestError } from "$lib/supabase";

export async function deleteSeriesById(
  context: ActionAPIContext,
  series_id: string,
) {
  const { error } = await context.locals.supabase
    .from("series")
    .delete()
    .eq("id", series_id);

  if (error) handlePostgrestError(error);

  return true;
}
