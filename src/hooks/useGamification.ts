import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_required: number;
  reports_required: number;
  cleanups_required: number;
  streak_required: number;
  badge_type: string;
}

interface UserAchievement {
  id: string;
  user_telegram_id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
}

interface LeaderboardUser {
  telegram_id: string;
  pseudo: string;
  experience_points: number;
  level_current: number;
  reports_count: number;
  cleanups_count: number;
  streak_days: number;
  badges: string[];
  rank: number;
}

export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async (): Promise<Achievement[]> => {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('badge_type', { ascending: true })
        .order('points_required', { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });
};

export const useUserAchievements = (telegramId?: string) => {
  return useQuery({
    queryKey: ['user-achievements', telegramId],
    queryFn: async (): Promise<UserAchievement[]> => {
      if (!telegramId) return [];

      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_telegram_id', telegramId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!telegramId,
  });
};

export const useLeaderboard = (limit: number = 10) => {
  return useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async (): Promise<LeaderboardUser[]> => {
      const { data, error } = await supabase
        .from('users')
        .select(`
          telegram_id,
          pseudo,
          experience_points,
          level_current,
          reports_count,
          cleanups_count,
          streak_days,
          badges
        `)
        .not('pseudo', 'is', null)
        .order('experience_points', { ascending: false })
        .limit(limit);

      if (error) throw error;

      // Add rank to each user
      return (data || []).map((user, index) => ({
        ...user,
        rank: index + 1,
        badges: Array.isArray(user.badges) ? user.badges as string[] : []
      }));
    },
  });
};

export const useUserStats = (telegramId?: string) => {
  return useQuery({
    queryKey: ['user-stats', telegramId],
    queryFn: async () => {
      if (!telegramId) return null;

      const { data, error } = await supabase
        .from('users')
        .select(`
          telegram_id,
          pseudo,
          experience_points,
          level_current,
          reports_count,
          cleanups_count,
          streak_days,
          badges,
          last_activity_date
        `)
        .eq('telegram_id', telegramId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!telegramId,
  });
};