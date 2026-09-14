import type { Series } from ".";
import { type ActionAPIContext } from "astro:actions";
import { handlePostgrestError } from "$lib/supabase";

export default async (context: ActionAPIContext, series: Series) => {
  const { data, error } = await context.locals.supabase
    .from("series")
    .upsert(series)
    .select()
    .single();

  if (error) handlePostgrestError(error);

  return data;
};
