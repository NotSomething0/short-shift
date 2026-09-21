import { handlePostgrestError } from "$lib/supabase";
import type { ActionAPIContext } from "astro:actions";

export async function getAllEvents(context: ActionAPIContext) {
  const { data, error } = await context.locals.supabase
    .from("events")
    .select("*");

  if (error) handlePostgrestError(error);

  return data;
}
