import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import { handleAuthError, handlePostgrestError } from "$lib/supabase";
import * as profile from "../database/profile";

export default {
  getProfile: defineAction({
    handler: async (_, context) => {
      const { data, error } = await context.locals.supabase.auth.getClaims();

      if (error) handleAuthError(error);

      if (data?.claims.aud !== "authenticated")
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return await profile.getProfile(context);
    },
  }),
  followSeriesById: defineAction({
    input: z.uuid(),
    handler: async (series_id, context) => {
      const { data: series, error: seriesError } = await context.locals.supabase
        .from("series")
        .select()
        .eq("id", series_id);

      if (seriesError) handlePostgrestError(seriesError);

      if (!Array.isArray(series) || !series.length)
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Series not found",
        });

      await profile.followSeriesById(context, series_id);
    },
  }),
};
