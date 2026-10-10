import type { APIContext, MiddlewareNext } from "astro";

export default async function (context: APIContext, next: MiddlewareNext) {
  if (context.url.pathname.startsWith("/admin")) {
    context.request.headers.set("x-redirect-to", context.url.pathname);

    const { data } = await context.locals.supabase.auth.getClaims();

    if (!data?.claims.app_metadata?.admin) {
      context.session?.set(
        "alert",
        "You need to login to access the admin panel.",
      );
      return context.redirect(
        `/login?redirect_to=${encodeURIComponent(context.url.pathname)}`,
      );
    }
  }

  return next();
}
