
import { supabase } from '@/lib/supabase';

export type WaterLog = {
  id: string;
  user_id: string;
  amount_ml: number;
  consumed_on: string;
  created_at: string;
};

export type WaterGoal = {
  id: string;
  user_id: string;
  daily_goal_ml: number;
  created_at: string;
  updated_at: string;
};

export type AddWaterLogInput = {
  userId: string;
  amountMl: number;
  consumedOn: string;
};

export async function getWaterLogs(
  userId: string,
  startDate: string,
  endDate: string,
) {
  return supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('consumed_on', startDate)
    .lte('consumed_on', endDate)
    .order('created_at', { ascending: false })
    .returns<WaterLog[]>();
}

export async function addWaterLog({
  userId,
  amountMl,
  consumedOn,
}: AddWaterLogInput) {
  if (!Number.isSafeInteger(amountMl) || amountMl < 1 || amountMl > 5000) {
    throw new Error('Su miktarı 1 ile 5.000 ml arasında olmalıdır.');
  }

  return supabase
    .from('water_logs')
    .insert({
      user_id: userId,
      amount_ml: amountMl,
      consumed_on: consumedOn,
    })
    .select('*')
    .single<WaterLog>();
}

export async function deleteWaterLog(
  userId: string,
  logId: string,
) {
  return supabase
    .from('water_logs')
    .delete()
    .eq('id', logId)
    .eq('user_id', userId);
}

export async function getWaterGoal(userId: string) {
  return supabase
    .from('water_goals')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle<WaterGoal>();
}

export async function upsertWaterGoal(
  userId: string,
  dailyGoalMl: number,
) {
  if (
    !Number.isSafeInteger(dailyGoalMl) ||
    dailyGoalMl < 250 ||
    dailyGoalMl > 10000
  ) {
    throw new Error('Günlük su hedefi 250 ile 10.000 ml arasında olmalıdır.');
  }

  return supabase
    .from('water_goals')
    .upsert(
      {
        user_id: userId,
        daily_goal_ml: dailyGoalMl,
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .single<WaterGoal>();
}
