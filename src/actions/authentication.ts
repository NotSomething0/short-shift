import {
  ActionError,
  defineAction,
  type ActionAPIContext,
} from "astro:actions";
import { z } from "astro/zod";
import { handleAuthError, handlePostgrestError } from "$lib/supabase";
import * as db from "../database/profiles";

export default {
  signUp: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      password: z.string(),
      username: z.string(),
    }),
    handler: async (
      input: { email: string; password: string; username: string },
      context: ActionAPIContext,
    ) => {
      const { data: usernameExists, error: rpcError } =
        await context.locals.supabase.rpc("check_username_available", {
          check_username: input.username,
        });

      if (rpcError) handlePostgrestError(rpcError);

      if (!usernameExists)
        throw new ActionError({
          code: "CONFLICT",
          message: "Username already exists",
        });

      const { error } = await context.locals.supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            username: input.username,
          },
        },
      });

      if (error) handleAuthError(error);

      return { success: true };
    },
  }),
  signIn: defineAction({
    accept: "form",
    input: z.object({
      email: z.email(),
      password: z.string(),
    }),
    handler: async (
      input: { email: string; password: string },
      context: ActionAPIContext,
    ) => {
      const { data: signInData, error: signInError } =
        await context.locals.supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });

      if (signInError) {
        handleAuthError(signInError);
      }

      if (signInData.session?.user.id) {
        const data = await db.getProfileById(
          context,
          signInData.session?.user.id,
        );

        if (data) context.session?.set("profile", data);
      }

      context.session?.delete("alert");

      return { success: true };
    },
  }),
  signOut: defineAction({
    handler: async (_, context: ActionAPIContext) => {
      const { error } = await context.locals.supabase.auth.signOut();

      if (error) {
        handleAuthError(error);
      }

      return { success: true };
    },
  }),
  forgotPassword: defineAction({
    input: z.object({
      email: z.email(),
    }),
    accept: "form",
    handler: async (input, context: ActionAPIContext) => {
      const { error } =
        await context.locals.supabase.auth.resetPasswordForEmail(input.email, {
          redirectTo: "/update-password",
        });

      if (error) handleAuthError(error);

      return { success: true };
    },
  }),
};
