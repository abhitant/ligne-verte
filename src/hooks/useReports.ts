
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
  switch (status) {
    case 'validé':
      return 'validated';
    case 'rejeté':
      return 'rejected';
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
      console.log('Fetching reports from Supabase...');
      
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reports:', error);
        throw error;
      }

      console.log('Reports fetched:', data);

      return data.map((report: Report): MapReport => ({
        id: report.id,
        user: `Utilisateur ${report.user_telegram_id.slice(-4)}`, // Afficher seulement les 4 derniers caractères du telegram_id
        location: `Abidjan (${report.location_lat.toFixed(4)}, ${report.location_lng.toFixed(4)})`,
        coordinates: { lat: report.location_lat, lng: report.location_lng },
        description: report.description || 'Aucune description',
        status: getStatusFromDb(report.status),
        date: report.created_at || new Date().toISOString(),
        type: getTypeFromDescription(report.description)
      }));
    }
  });
};
