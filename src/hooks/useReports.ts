
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

interface UserDisplayInfo {
  pseudo: string | null;
  points_himpact: number | null;
  created_at: string | null;
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
  photo_url?: string;
  points_awarded: number;
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
      console.log('Starting reports fetch from Supabase...');
      
      try {
        // Utiliser la fonction RPC publique pour récupérer les signalements
        const { data: reports, error } = await supabase
          .rpc('get_public_reports');

        if (error) {
          console.error('Error fetching reports:', error);
          return [];
        }

        console.log('Raw reports data from Supabase:', reports);
        console.log('Number of reports found:', reports?.length || 0);

        if (!reports || reports.length === 0) {
          console.log('No reports found in database');
          return [];
        }

        const mappedReports = reports.map((report): MapReport => {
          // Utiliser le pseudo de l'utilisateur fourni par la fonction RPC
          const displayName = report.reporter_pseudo || 'Anonyme';
          
          return {
            id: report.id,
            user: displayName,
            location: `Abidjan (${Number(report.location_lat).toFixed(3)}, ${Number(report.location_lng).toFixed(3)})`,
            coordinates: { 
              lat: Number(report.location_lat), 
              lng: Number(report.location_lng) 
            },
            description: report.description || 'Signalement via bot Telegram',
            status: getStatusFromDb(report.status),
            date: report.created_at || new Date().toISOString(),
            type: getTypeFromDescription(report.description || report.waste_type),
            photo_url: report.photo_url
          };
        });

        console.log('Final mapped reports for display:', mappedReports);
        return mappedReports;
      } catch (error) {
        console.error('Critical error in reports fetch:', error);
        return [];
      }
    },
    refetchInterval: 30000,
    retry: 2,
    retryDelay: 1000,
    staleTime: 5000,
  });
};


