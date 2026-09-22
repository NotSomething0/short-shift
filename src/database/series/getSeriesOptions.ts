import { handlePostgrestError } from "$lib/supabase";
import type { ActionAPIContext } from "astro:actions";

export async function getSeriesOptions(context: ActionAPIContext) {
  const [statuses, categories] = await Promise.all([
    context.locals.supabase.rpc("get_types", {
      enum_type: "Series Status",
    }),
    context.locals.supabase.rpc("get_types", {
      enum_type: "Series Category",
    }),
  ]);

  if (statuses.error) handlePostgrestError(statuses.error);

  if (categories.error) handlePostgrestError(categories.error);

  return {
    statuses: statuses.data,
    categories: categories.data,
  };
}
