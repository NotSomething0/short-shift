import { sequence } from "astro:middleware";
import protectAdminPaths from "./admin/protectAdminPaths";
import supabase from "./supabase";

export const onRequest = sequence(supabase, protectAdminPaths);
