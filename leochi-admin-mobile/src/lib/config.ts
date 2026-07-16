const required = [
  "EXPO_PUBLIC_SUPABASE_URL",
  "EXPO_PUBLIC_SUPABASE_ANON_KEY",
  "EXPO_PUBLIC_API_BASE_URL"
] as const;

function getEnv(name: (typeof required)[number]) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

export const env = {
  supabaseUrl: getEnv("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  apiBaseUrl: getEnv("EXPO_PUBLIC_API_BASE_URL")
};
