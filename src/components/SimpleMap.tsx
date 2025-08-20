import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportLocation {
  id: string;
  location_lat: number;
  location_lng: number;
}

const useSimpleReports = () => {
  return useQuery({
    queryKey: ['simple-reports'],
    queryFn: async (): Promise<ReportLocation[]> => {
      console.log('Fetching report locations directly from reports table...');
      
      try {
        // Utiliser directement la table reports avec les nouvelles politiques publiques
        const { data: reports, error } = await supabase
          .from('reports')
          .select('id, location_lat, location_lng')
          .not('location_lat', 'is', null)
          .not('location_lng', 'is', null);

        if (error) {
          console.error('Error fetching reports directly:', error);
          throw error;
        }

        console.log('Report locations fetched directly:', reports?.length || 0, 'locations');
        return reports || [];
      } catch (error) {
        console.error('Critical error in reports fetch:', error);
        throw error;
      }
    },
    refetchInterval: 60000, // Actualiser toutes les minutes
    retry: 3,
    staleTime: 30000,
  });
};

const SimpleMap = () => {
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<any>(null);
  
  // Centre sur Abidjan
  const center: [number, number] = [5.3478, -4.0267];

  const { data: reports = [], isLoading, error, refetch } = useSimpleReports();

  console.log('SimpleMap rendered with', reports.length, 'report locations');

  // Timeout pour forcer l'erreur si la carte prend trop de temps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapLoaded && !mapError) {
        console.log('Map loading timeout');
        setMapError(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [mapLoaded, mapError]);

  if (error) {
    console.error('SimpleMap error:', error);
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">
              <p className="font-semibold">Erreur lors du chargement de la carte</p>
              <p className="text-sm mt-2">Impossible de récupérer les données des signalements.</p>
            </div>
            <Button 
              onClick={() => refetch()}
              className="bg-primary hover:bg-primary/90"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-foreground font-medium">Chargement de la carte...</p>
          <p className="text-muted-foreground text-sm mt-2">
            {reports.length > 0 ? `${reports.length} signalement(s) trouvé(s)` : 'Recherche des signalements...'}
          </p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-orange-600 mb-4">
              <p className="font-semibold">Carte non disponible</p>
              <p className="text-sm mt-2">La carte interactive ne peut pas se charger pour le moment.</p>
              <p className="text-sm text-green-600 font-medium mt-2">
                {reports.length} signalement(s) disponible(s)
              </p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recharger la page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* Indicateur de chargement */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-primary text-sm">Chargement de la carte...</p>
            <button 
              onClick={() => setMapError(true)}
              className="mt-2 text-xs text-muted-foreground underline hover:text-foreground"
            >
              Problème de chargement ?
            </button>
          </div>
        </div>
      )}

      {/* Compteur de signalements */}
      <div className="absolute top-3 left-3 z-20 bg-background/90 backdrop-blur-sm border rounded-lg shadow px-3 py-2">
        <div className="text-sm font-medium text-foreground">
          {reports.length} signalement{reports.length > 1 ? 's' : ''}
        </div>
      </div>
      
      <div style={{ height: '100%', width: '100%' }}>
        <MapContainer 
          center={center} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          ref={mapRef}
          whenReady={() => {
            console.log('SimpleMap ready successfully');
            setMapLoaded(true);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            eventHandlers={{
              tileerror: (e) => {
                console.error('Tile loading error:', e);
                setTimeout(() => setMapError(true), 2000);
              }
            }}
          />
          
          {/* Pastilles simples pour chaque signalement */}
          {reports.map((report) => (
            <CircleMarker
              key={report.id}
              center={[report.location_lat, report.location_lng]}
              radius={6}
              pathOptions={{
                color: 'hsl(var(--primary))',
                fillColor: 'hsl(var(--primary))',
                fillOpacity: 0.7,
                weight: 2
              }}
            />
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default SimpleMap;
