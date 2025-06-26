
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
      
      // Récupérer tous les signalements
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

      // Récupérer les IDs Telegram uniques
      const uniqueTelegramIds = [...new Set(reports.map(r => r.user_telegram_id))];
      console.log('Unique telegram IDs in reports:', uniqueTelegramIds);

      // Récupérer TOUS les utilisateurs directement depuis la table users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('telegram_id, pseudo, telegram_username, points_himpact')
        .in('telegram_id', uniqueTelegramIds);

      if (usersError) {
        console.error('Error fetching users:', usersError);
        throw usersError;
      }

      console.log('Users fetched from database:', users);

      // Créer une map pour un accès rapide aux données utilisateur
      const usersMap = new Map();
      users?.forEach(user => {
        usersMap.set(user.telegram_id, user);
        console.log(`User ${user.telegram_id} mapped:`, {
          telegram_username: user.telegram_username,
          pseudo: user.pseudo,
          points: user.points_himpact
        });
      });

      console.log('Final users map:', usersMap);

      const mappedReports = reports.map((report): MapReport => {
        const user = usersMap.get(report.user_telegram_id);
        let displayName = `Utilisateur ${report.user_telegram_id.slice(-4)}`;
        
        if (user) {
          console.log(`Processing user ${report.user_telegram_id}:`, {
            telegram_username: user.telegram_username,
            pseudo: user.pseudo
          });
          
          // Prioriser telegram_username, puis pseudo
          if (user.telegram_username && user.telegram_username.trim() !== '') {
            displayName = `@${user.telegram_username}`;
          } else if (user.pseudo && user.pseudo.trim() !== '' && user.pseudo !== `User ${report.user_telegram_id.slice(-4)}`) {
            displayName = user.pseudo;
          }
          
          console.log(`Final display name for ${report.user_telegram_id}: ${displayName}`);
        } else {
          console.log(`No user found for ${report.user_telegram_id}, using fallback: ${displayName}`);
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

      console.log('Final mapped reports for display:', mappedReports);
      return mappedReports;
    },
    refetchInterval: 30000, // Refetch every 30 seconds to get new reports
  });
};
