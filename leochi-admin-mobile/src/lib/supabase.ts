import { createClient } from "@supabase/supabase-js";
import { env } from "./config";

export const supabase =
	env.supabaseUrl && env.supabaseAnonKey
		? createClient(env.supabaseUrl, env.supabaseAnonKey)
		: null;
