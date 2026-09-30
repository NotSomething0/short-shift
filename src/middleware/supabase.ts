import type { APIContext, MiddlewareNext } from "astro";
import type { Database } from "../types/supabase";
import { createServerClient, parseCookieHeader } from "@supabase/ssr";

export default async (context: APIContext, next: MiddlewareNext) => {
  context.locals.supabase = createServerClient<Database>(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(context.request.headers.get("Cookie") ?? "");
        },
        setAll(cookiesToSet: { name: string; value: string }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            context.cookies.set(name, value, {
              path: "/",
              secure: import.meta.env.PROD,
            });
          });
        },
      },
    },
  );

  return next();
};
