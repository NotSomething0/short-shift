import type { ActionAPIContext } from "astro:actions";
import { handlePostgrestError } from "$lib/supabase";

export async function getSeriesList(context: ActionAPIContext) {
  const { data, error } = await context.locals.supabase
    .from("series")
    .select(`id, name`);

  if (error) handlePostgrestError(error);

  return data;
}
