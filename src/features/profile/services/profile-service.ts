import { supabase } from '@/lib/supabase';

import type { Profile } from '../types/profile';

export async function getProfile(userId: string) {
  return supabase.from('profiles').select('*').eq('id', userId).single<Profile>();
}
