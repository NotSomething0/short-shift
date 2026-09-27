interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_PUB_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace App {
  interface Locals {
    supabase: import("@supabase/supabase-js").SupabaseClient<
      import("./types/supabase").Database
    >;
  }
  interface SessionData {
    profile: import("./types/supabase").Tables<"profiles">;
  }
}
