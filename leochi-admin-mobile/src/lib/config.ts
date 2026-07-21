type RequiredEnvName = "EXPO_PUBLIC_API_BASE_URL";

function getRequiredEnv(name: RequiredEnvName) {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required.`);
  }
  return value;
}

function getOptionalEnv(name: "EXPO_PUBLIC_SUPABASE_URL" | "EXPO_PUBLIC_SUPABASE_ANON_KEY") {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    return null;
  }
  return value;
}

export const env = {
  supabaseUrl: getOptionalEnv("EXPO_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: getOptionalEnv("EXPO_PUBLIC_SUPABASE_ANON_KEY"),
  apiBaseUrl: getRequiredEnv("EXPO_PUBLIC_API_BASE_URL")
};
