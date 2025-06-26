
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Report {
  id: string;
  user_telegram_id: string;
  photo_url: string | null;
  description: string | null;
  location_lat: number;
  location_lng: number;
  status: string | null;
  created_at: string | null;
}

interface User {
  telegram_id: string;
  pseudo: string | null;
  telegram_username: string | null;
}

interface MapReport {
  id: string;
  user: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  status: 'pending' | 'validated' | 'rejected';
  date: string;
  type: 'waste' | 'drain' | 'other';
}

const getStatusFromDb = (status: string | null): 'pending' | 'validated' | 'rejected' => {
  if (!status) return 'pending';
  
  const normalizedStatus = status.toLowerCase().trim();
  console.log('Status from DB:', status, 'Normalized:', normalizedStatus);
  
  switch (normalizedStatus) {
    case 'validé':
    case 'validated':
      return 'validated';
    case 'rejeté':
    case 'rejected':
      return 'rejected';
    case 'en attente':
    case 'pending':
    default:
      return 'pending';
  }
};

const getTypeFromDescription = (description: string | null): 'waste' | 'drain' | 'other' => {
  if (!description) return 'other';
  const desc = description.toLowerCase();
  if (desc.includes('poubelle') || desc.includes('déchet') || desc.includes('ordure')) {
    return 'waste';
  }
  if (desc.includes('caniveau') || desc.includes('égout') || desc.includes('drainage')) {
    return 'drain';
  }
  return 'other';
};

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async (): Promise<MapReport[]> => {
      console.log('Fetching reports with user details from Supabase...');
      
      // D'abord récupérer tous les signalements
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
        throw reportsError;
      }

      console.log('Raw reports data from Supabase:', reports);
      console.log('Number of reports found:', reports?.length || 0);

      if (!reports || reports.length === 0) {
        console.log('No reports found in database');
        return [];
      }

      // Ensuite récupérer les informations utilisateur pour chaque signalement
      const reportsWithUsers = await Promise.all(
        reports.map(async (report) => {
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('telegram_id, pseudo, telegram_username')
            .eq('telegram_id', report.user_telegram_id)
            .single();

          if (userError) {
            console.log(`No user found for telegram_id: ${report.user_telegram_id}`);
          }

          return {
            ...report,
            user: user
          };
        })
      );

      // Log each report for debugging
      reportsWithUsers.forEach((report, index) => {
        console.log(`Report ${index + 1}:`, {
          id: report.id,
          status: report.status,
          user: report.user,
          user_telegram_id: report.user_telegram_id,
          location: { lat: report.location_lat, lng: report.location_lng },
          created_at: report.created_at
        });
      });

      const mappedReports = reportsWithUsers.map((report): MapReport => {
        const user = report.user;
        let displayName = `Utilisateur ${report.user_telegram_id.slice(-4)}`;
        
        if (user) {
          displayName = user.pseudo || user.telegram_username || displayName;
        }
        
        return {
          id: report.id,
          user: displayName,
          location: `Abidjan (${report.location_lat.toFixed(4)}, ${report.location_lng.toFixed(4)})`,
          coordinates: { lat: report.location_lat, lng: report.location_lng },
          description: report.description || 'Signalement via bot Telegram',
          status: getStatusFromDb(report.status),
          date: report.created_at || new Date().toISOString(),
          type: getTypeFromDescription(report.description)
        };
      });

      console.log('Mapped reports for display:', mappedReports);
      return mappedReports;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to get new reports
  });
};
