import type { SeriesInsert } from ".";
import { type ActionAPIContext } from "astro:actions";
import { handlePostgrestError } from "$lib/supabase";

export async function createSeries(
  context: ActionAPIContext,
  series: SeriesInsert,
) {
  const { data, error } = await context.locals.supabase
    .from("series")
    .upsert(series)
    .select()
    .single();

  if (error) handlePostgrestError(error);

  return data;
}
