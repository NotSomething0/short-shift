import { handlePostgrestError } from "$lib/supabase";
import type { ActionAPIContext } from "astro:actions";

export async function getSeriesById(
  context: ActionAPIContext,
  series_id: string,
) {
  const { data: series, error } = await context.locals.supabase
    .from("series")
    .select()
    .eq("id", series_id);

  if (error) handlePostgrestError(error);

  return series;
}
