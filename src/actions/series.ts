import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import * as db from "../database/series";
import { handleAuthError } from "$lib/supabase";

export default {
  createSeries: defineAction({
    input: z.custom<db.SeriesInsert>(),
    handler: async (input, context) => {
      const { data: claimsData, error: claimsError } =
        await context.locals.supabase.auth.getClaims();

      if (claimsError) handleAuthError(claimsError);

      if (!claimsData?.claims?.app_metadata?.admin)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Not authorized to preform this action.",
        });

      return await db.createSeries(context, input);
    },
  }),
  getSeriesById: defineAction({
    input: z.uuid(),
    handler: async (input, context) => {
      return await db.getSeriesById(context, input);
    },
  }),
  getAllSeries: defineAction({
    handler: async (_, context) => {
      return await db.getAllSeries(context);
    },
  }),
  updateSeries: defineAction({
    input: z.custom<db.Series>(),
    handler: async (input, context) => {
      const { data, error } = await context.locals.supabase.auth.getClaims();

      if (error) handleAuthError(error);

      if (!data?.claims.app_metadata?.admin)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return await db.updateSeries(context, input);
    },
  }),
  deleteSeriesById: defineAction({
    input: z.uuid(),
    handler: async (input, context) => {
      const { data: claimsData, error: claimsError } =
        await context.locals.supabase.auth.getClaims();

      if (claimsError) handleAuthError(claimsError);

      if (!claimsData?.claims.app_metadata?.admin)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action",
        });

      return await db.deleteSeriesById(context, input);
    },
  }),
};
