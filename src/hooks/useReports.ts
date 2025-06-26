
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
      
      // Récupérer les signalements avec les informations utilisateur via une jointure
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          users!inner(telegram_id, pseudo, telegram_username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }

      console.log('Raw reports data with users from Supabase:', data);
      console.log('Number of reports found:', data?.length || 0);

      if (!data || data.length === 0) {
        console.log('No reports found in database');
        return [];
      }

      // Log each report for debugging
      data.forEach((report, index) => {
        console.log(`Report ${index + 1}:`, {
          id: report.id,
          status: report.status,
          user: report.users,
          location: { lat: report.location_lat, lng: report.location_lng },
          created_at: report.created_at
        });
      });

      const mappedReports = data.map((report: any): MapReport => {
        const user = report.users;
        const displayName = user.pseudo || user.telegram_username || `Utilisateur ${user.telegram_id.slice(-4)}`;
        
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
