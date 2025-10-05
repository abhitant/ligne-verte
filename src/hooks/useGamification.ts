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
  points_himpact: number;
  experience_points: number;
  level_current: number;
  reports_count: number;
  cleanups_count: number;
  streak_days: number;
  badges: Json;
  created_at: string;
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
      try {
        const { data: users, error } = await supabase
          .from('user_public_profiles')
          .select(`
            telegram_id,
            pseudo,
            points_himpact,
            experience_points,
            level_current,
            reports_count,
            badges,
            created_at
          `)
          .gt('points_himpact', 0)
          .order('points_himpact', { ascending: false })
          .order('reports_count', { ascending: false })
          .order('created_at', { ascending: true })
          .limit(limit);

        if (error) {
          console.error('Error fetching leaderboard:', error);
          throw error;
        }

        console.log('Real leaderboard data from Supabase:', users);
        
        // Add rank and default values to each user
        return (users || []).map((user, index) => ({
          ...user,
          rank: index + 1,
          cleanups_count: 0, // Not in public profile
          streak_days: 0 // Not in public profile
        }));
      } catch (error) {
        console.error('Critical error fetching leaderboard:', error);
        return [];
      }
    },
    refetchInterval: 30000,
    retry: 2,
    staleTime: 10000,
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