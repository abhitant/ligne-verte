import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pour les markers par défaut dans react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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

interface OpenStreetMapProps {
  reports: MapReport[];
  selectedReport: MapReport | null;
  onReportSelect: (report: MapReport) => void;
  filter: 'all' | 'pending' | 'validated';
  showLegend?: boolean;
  zoom?: number;
}

// Composant de fallback avec vraie liste si la carte ne charge pas
const MapFallback = ({ reports, selectedReport, onReportSelect, filter }: OpenStreetMapProps) => {
  const navigate = useNavigate();
  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  return (
    <div className="h-full w-full bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-start p-4 rounded-lg border-2 border-green-200 overflow-y-auto">
      <div className="text-center mb-4 w-full">
        <h3 className="text-lg font-bold text-red-600 mb-2">⚠️ Carte non disponible</h3>
        <div className="bg-card rounded-lg p-3 shadow-sm border border-red-200 mb-4">
          <p className="text-red-600 text-sm">La carte interactive ne peut pas se charger.</p>
          <p className="text-muted-foreground text-sm">Voici la liste des signalements :</p>
          <p className="text-green-500 text-lg font-bold mt-2">{filteredReports.length} signalement(s)</p>
        </div>
      </div>
      
      <div className="w-full max-w-2xl space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg shadow-sm">
            <p className="text-muted-foreground">Aucun signalement trouvé</p>
          </div>
        ) : (
          filteredReports.map((report, index) => (
            <div
              key={report.id}
              className={`p-4 bg-card rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                selectedReport?.id === report.id ? 'ring-2 ring-green-500 border-green-500' : 'border-border'
              }`}
              onClick={() => {
                onReportSelect(report);
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {report.type === 'waste' ? '🗑️' : report.type === 'drain' ? '🚰' : '⚠️'}
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">{report.user}</span>
                    <p className="text-sm text-muted-foreground">{report.location}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${
                  report.status === 'validated' ? 'bg-green-500' :
                  report.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              </div>
              <p className="text-foreground text-sm mb-2">{report.description}</p>
              <div className="text-xs text-blue-600 bg-surface p-2 rounded">
                📍 {report.coordinates.lat.toFixed(6)}, {report.coordinates.lng.toFixed(6)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const OpenStreetMap = ({ reports, selectedReport, onReportSelect, filter, showLegend = true, zoom = 12 }: OpenStreetMapProps) => {
  const navigate = useNavigate();
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const mapRef = useRef<any>(null);
  
  
  // Centre sur Abidjan
  const center: [number, number] = [5.3478, -4.0267];

  // Filtrer les rapports selon le filtre actuel et exclure les rejetés
  const filteredReports = reports.filter(report => 
    report.status !== 'rejected' &&
    (filter === 'all' || report.status === filter)
  );

  console.log('OpenStreetMap rendered with', filteredReports.length, 'reports');

  // Communes d'Abidjan : géocodage inverse local, sans API externe (aucune clé requise).
  // Centre approximatif + rayon en km pour chaque commune.
  const ABIDJAN_COMMUNES: Array<{ name: string; lat: number; lng: number; radius: number }> = [
    { name: 'Abobo', lat: 5.4161, lng: -4.0203, radius: 7 },
    { name: 'Adjamé', lat: 5.3667, lng: -4.0236, radius: 3 },
    { name: 'Attécoubé', lat: 5.3400, lng: -4.0433, radius: 3.5 },
    { name: 'Cocody', lat: 5.3544, lng: -3.9856, radius: 6 },
    { name: 'Koumassi', lat: 5.2953, lng: -3.9511, radius: 4 },
    { name: 'Marcory', lat: 5.3067, lng: -3.9836, radius: 3.5 },
    { name: 'Plateau', lat: 5.3245, lng: -4.0196, radius: 2.5 },
    { name: 'Port-Bouët', lat: 5.2564, lng: -3.9264, radius: 6 },
    { name: 'Treichville', lat: 5.2967, lng: -4.0083, radius: 2.5 },
    { name: 'Yopougon', lat: 5.3364, lng: -4.0867, radius: 8 },
    { name: 'Bingerville', lat: 5.3558, lng: -3.8853, radius: 5 },
    { name: 'Anyama', lat: 5.4946, lng: -4.0518, radius: 6 },
    { name: 'Songon', lat: 5.3200, lng: -4.2400, radius: 6 },
  ];

  const toRad = (d: number) => (d * Math.PI) / 180;
  const distanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  };

  // Commune la plus proche dans son rayon, sinon "Abidjan".
  const getLocationName = (lat: number, lng: number): string => {
    let best: { name: string; dist: number } | null = null;
    for (const c of ABIDJAN_COMMUNES) {
      const dist = distanceKm(lat, lng, c.lat, c.lng);
      if (dist <= c.radius && (!best || dist < best.dist)) {
        best = { name: c.name, dist };
      }
    }
    return best ? best.name : 'Abidjan';
  };

  // Résolution synchrone des localités (mémoïsée, pas de state → pas de boucle)
  const locationNames = useMemo(() => {
    const next: Record<string, string> = {};
    filteredReports.forEach(report => {
      next[report.id] = getLocationName(report.coordinates.lat, report.coordinates.lng);
    });
    return next;
  }, [reports, filter]);

  // Timeout pour forcer le fallback si la carte prend trop de temps
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapLoaded && !mapError) {
        console.log('Map loading timeout, switching to fallback');
        setLoadingTimeout(true);
        setMapError(true);
      }
    }, 10000); // 10 secondes

    return () => clearTimeout(timer);
  }, [mapLoaded, mapError]);

  // Marqueurs HUD selon le statut
  const createCustomIcon = (status: string) => {
    const validated = status === 'validated' || status === 'validé';
    const color = validated ? 'hsl(78 100% 60%)' : 'hsl(38 96% 56%)';

    return divIcon({
      className: '',
      html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${color};box-shadow:0 0 0 3px ${color}33, 0 0 14px ${color};border:2px solid hsl(158 45% 5%);"></span>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
      popupAnchor: [0, -10],
    });
  };


  // Si il y a une erreur ou timeout, afficher le fallback
  if (mapError || loadingTimeout) {
    return <MapFallback reports={reports} selectedReport={selectedReport} onReportSelect={onReportSelect} filter={filter} />;
  }

  return (
    <div className="relative h-full w-full">
      {/* Indicateur de chargement amélioré */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-surface flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-green-600 text-sm">Chargement de la carte...</p>
            <div className="mt-4 space-y-2">
              <button 
                onClick={() => {
                  console.log('User requested fallback mode');
                  setMapError(true);
                }}
                className="block mx-auto text-xs text-blue-600 underline hover:text-blue-800 bg-card px-3 py-1 rounded"
              >
                Problème ? Cliquez ici pour la version alternative
              </button>
              <button 
                onClick={() => {
                  console.log('User requested page reload');
                  window.location.reload();
                }}
                className="block mx-auto text-xs text-muted-foreground underline hover:text-foreground"
              >
                Ou recharger la page
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Légende et zones d'opération */}
      {showLegend && (
      <div className="hud-panel absolute top-4 left-16 z-[1000] p-5 bg-card/95">
        <p className="hud-label mb-4">Signalements</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-signal inline-block"></span>
            <span className="text-sm text-card-foreground">Validés</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-alert inline-block"></span>
            <span className="text-sm text-card-foreground">En attente</span>
          </div>
          <div className="pt-3 border-t border-border">
            <span className="font-mono text-sm text-accent">{filteredReports.length} rapports</span>
          </div>
        </div>
      </div>
      )}

      {/* Voile tactique HUD léger pour garder la carte grise lisible */}
      <div className="pointer-events-none absolute inset-0 z-[900] hud-scanlines opacity-15" />
      <div className="pointer-events-none absolute inset-0 z-[900] bg-[radial-gradient(ellipse_at_center,transparent_60%,hsl(var(--background)/0.35)_100%)]" />

      <div style={{ height: '100%', width: '100%' }}>
        <MapContainer 
          center={center} 
          zoom={zoom} 
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg"
          ref={mapRef}
          whenReady={() => {
            console.log('Map ready successfully');
            setMapLoaded(true);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            eventHandlers={{
              loading: () => console.log('Tiles loading...'),
              load: () => console.log('Tiles loaded successfully'),
              tileerror: (e) => {
                console.error('Tile loading error:', e);
                setTimeout(() => setMapError(true), 2000);
              }
            }}
          />
          
          {/* Marqueurs pour chaque signalement */}
          {filteredReports.map((report) => (
            <Marker
              key={report.id}
              position={[report.coordinates.lat, report.coordinates.lng]}
              icon={createCustomIcon(report.status)}
              eventHandlers={{
                click: () => {
                  onReportSelect(report);
                }
              }}
            >
              <Popup>
                <div className="p-2 max-w-xs">
                  <h3 className="font-bold text-sm mb-1">{report.user}</h3>
                  <p className="text-xs text-muted-foreground mb-1 font-medium">
                    {locationNames[report.id] || 'Chargement...'}
                  </p>
                  {report.description && 
                   !report.description.includes('Signalement via Telegram') && 
                   report.description !== 'Signalement via bot Telegram' && (
                    <p className="text-xs mb-2">{report.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      report.status === 'validated' ? 'bg-surface text-green-800' :
                      report.status === 'rejected' ? 'bg-surface text-red-800' :
                      'bg-surface text-yellow-800'
                    }`}>
                      {report.status === 'validated' ? 'Validé' : 
                       report.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(report.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-blue-600">
                    📍 {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default OpenStreetMap;
