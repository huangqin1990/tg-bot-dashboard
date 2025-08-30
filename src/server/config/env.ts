import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  supabase: {
    url: process.env.SUPABASE_URL!,
    key: process.env.SUPABASE_KEY!,
  },
};

if (!config.supabase.url || !config.supabase.key) {
  throw new Error('Missing required environment variables: SUPABASE_URL or SUPABASE_KEY');
}