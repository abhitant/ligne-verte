
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
        // Récupérer tous les signalements depuis la vue publique sécurisée
        const { data: reports, error: reportsError } = await supabase
          .from('reports_public')
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

        // Les IDs Telegram ne sont plus accessibles, nous utilisons le hash anonymisé
        console.log('Using anonymized reporter hashes for security');

        const mappedReports = reports.map((report): MapReport => {
          // Utiliser le hash anonymisé pour l'affichage sécurisé
          const displayName = `Reporter#${report.reporter_hash.slice(-6)}`;
          
          console.log(`Using anonymized display name for security: ${displayName}`);
          
          return {
            id: report.id,
            user: displayName,
            location: `Abidjan (${report.location_lat.toFixed(3)}, ${report.location_lng.toFixed(3)})`,
            coordinates: { lat: report.location_lat, lng: report.location_lng },
            description: report.description || 'Signalement via bot Telegram',
            status: getStatusFromDb(report.status),
            date: report.created_at || new Date().toISOString(),
            type: getTypeFromDescription(report.description),
            photo_url: report.photo_url
          };
        });

        console.log('Final mapped reports for display:', mappedReports);
        return mappedReports;
      } catch (error) {
        console.error('Critical error in reports fetch:', error);
        // Return empty array instead of throwing to prevent app crash
        return [];
      }
    },
    refetchInterval: 30000,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5000, // Consider data fresh for 5 seconds
  });
};
