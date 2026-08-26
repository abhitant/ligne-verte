import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  organization_name: string;
  organization_logo_url: string | null;
  category: string | null;
  bonus_points: number;
  target_reports: number | null;
  zone: string | null;
  image_url: string | null;
  cta_url: string | null;
  starts_at: string;
  ends_at: string | null;
}

export const useChallenges = () => {
  return useQuery({
    queryKey: ["challenges"],
    queryFn: async (): Promise<Challenge[]> => {
      const { data, error } = await supabase
        .from("challenges")
        .select(
          "id,title,description,organization_name,organization_logo_url,category,bonus_points,target_reports,zone,image_url,cta_url,starts_at,ends_at"
        )
        .eq("is_published", true)
        .order("ends_at", { ascending: true, nullsFirst: false });

      if (error) throw error;
      return (data ?? []) as Challenge[];
    },
    staleTime: 60_000,
  });
};

export const isChallengeActive = (c: Challenge) => {
  const now = Date.now();
  const start = new Date(c.starts_at).getTime();
  const end = c.ends_at ? new Date(c.ends_at).getTime() : Infinity;
  return start <= now && now <= end;
};

export const daysLeft = (c: Challenge) => {
  if (!c.ends_at) return null;
  const diff = new Date(c.ends_at).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
};
