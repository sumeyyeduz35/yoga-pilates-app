function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const env = {
  get supabaseUrl(): string {
    return requireEnv(supabaseUrl, 'EXPO_PUBLIC_SUPABASE_URL');
  },

  get supabasePublishableKey(): string {
    return requireEnv(supabasePublishableKey, 'EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
  },
} as const;
