import type { ActionAPIContext } from "astro:actions";
import { handlePostgrestError } from "$lib/supabase";

export async function getEventsBySeriesId(
  context: ActionAPIContext,
  series_id: string[],
) {
  const { data, error } = await context.locals.supabase
    .from("events")
    .select()
    .in("series_id", series_id);

  if (error) handlePostgrestError(error);

  return data;

  return data;
}
