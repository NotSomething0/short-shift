import type { ActionAPIContext } from "astro:actions";
import type { Event } from ".";
import { handlePostgrestError } from "$lib/supabase";

export async function createEvent(
  context: ActionAPIContext,
  event: Event,
) {
  const { data, error } = await context.locals.supabase
    .from("events")
    .insert(event)
    .select()
    .single();

  if (error)
    handlePostgrestError(error);

  return data;  
};
