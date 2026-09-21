import { handlePostgrestError } from "$lib/supabase";
import type { ActionAPIContext } from "astro:actions";

export async function deleteEvent(context: ActionAPIContext, event_id: string) {
  const { error } = await context.locals.supabase
    .from("events")
    .delete()
    .eq("id", event_id);

  if (error) handlePostgrestError(error);
}
