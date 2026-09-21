import { ActionError, defineAction } from "astro:actions";
import { z } from "astro/zod";
import * as db from "../database/events";
import { handleAuthError } from "$lib/supabase";
import type { Event } from "../database/events";

export default {
  createEvent: defineAction({
    input: z.custom<Event>(),
    handler: async (input, context) => {
      const { data, error } = await context.locals.supabase.auth.getClaims();

      if (error) handleAuthError(error);

      if (!data?.claims.app_metadata?.admin)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return await db.createEvent(context, input);
    },
  }),
  getEventsBySeriesId: defineAction({
    input: z.array(z.uuid()),
    handler: async (input, context) =>
      await db.getEventsBySeriesId(context, input),
  }),
  updateEvent: defineAction({
    input: z.custom<Event>(),
    handler: async (input, context) => {
      const { data, error } = await context.locals.supabase.auth.getClaims();

      if (error) handleAuthError(error);

      if (!data?.claims.app_metadata?.admin)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      return await db.updateEvent(context, input);
    },
  }),
  deleteEvent: defineAction({
    input: z.uuid(),
    handler: async (input, context) => {
      const { data, error } = await context.locals.supabase.auth.getClaims();

      if (error) handleAuthError(error);

      if (!data?.claims.app_metadata?.admin)
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to perform this action.",
        });

      await db.deleteEventById(context, input);
    },
  }),
};
