import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
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
        <div className="bg-white rounded-lg p-3 shadow-sm border border-red-200 mb-4">
          <p className="text-red-600 text-sm">La carte interactive ne peut pas se charger.</p>
          <p className="text-gray-600 text-sm">Voici la liste des signalements :</p>
          <p className="text-green-500 text-lg font-bold mt-2">{filteredReports.length} signalement(s)</p>
        </div>
      </div>
      
      <div className="w-full max-w-2xl space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Aucun signalement trouvé</p>
          </div>
        ) : (
          filteredReports.map((report, index) => (
            <div
              key={report.id}
              className={`p-4 bg-white rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                selectedReport?.id === report.id ? 'ring-2 ring-green-500 border-green-500' : 'border-gray-200'
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
                    <span className="font-semibold text-gray-800">{report.user}</span>
                    <p className="text-sm text-gray-500">{report.location}</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${
                  report.status === 'validated' ? 'bg-green-500' :
                  report.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              </div>
              <p className="text-gray-700 text-sm mb-2">{report.description}</p>
              <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
                📍 {report.coordinates.lat.toFixed(6)}, {report.coordinates.lng.toFixed(6)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const OpenStreetMap = ({ reports, selectedReport, onReportSelect, filter }: OpenStreetMapProps) => {
  const navigate = useNavigate();
  const [mapError, setMapError] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const mapRef = useRef<any>(null);
  const [locationNames, setLocationNames] = useState<Record<string, string>>({});
  
  // Centre sur Abidjan
  const center: [number, number] = [5.3478, -4.0267];

  // Filtrer les rapports selon le filtre actuel
  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  console.log('OpenStreetMap rendered with', filteredReports.length, 'reports');

  // Fonction pour obtenir le nom de la localité via géocodage inverse
  const fetchLocationName = async (lat: number, lng: number, reportId: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
      );
      const data = await response.json();
      
      if (data.address) {
        const { suburb, neighbourhood, quarter, city_district, city, town, village } = data.address;
        const locality = suburb || neighbourhood || quarter || city_district || town || village || city || 'Abidjan';
        setLocationNames(prev => ({ ...prev, [reportId]: locality }));
      }
    } catch (error) {
      console.error('Error fetching location name:', error);
    }
  };

  // Charger les noms de localités pour tous les rapports visibles
  useEffect(() => {
    filteredReports.forEach(report => {
      if (!locationNames[report.id]) {
        fetchLocationName(report.coordinates.lat, report.coordinates.lng, report.id);
      }
    });
  }, [filteredReports]);

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

  // Créer des icônes personnalisées selon le statut
  const createCustomIcon = (status: string) => {
    let color = 'red';
    if (status === 'validé') {
      color = 'green';
    } else if (status === 'en attente') {
      color = 'yellow';
    } else if (status === 'rejeté') {
      color = 'red';
    }
    
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
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
        <div className="absolute inset-0 bg-green-50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-green-600 text-sm">Chargement de la carte...</p>
            <div className="mt-4 space-y-2">
              <button 
                onClick={() => {
                  console.log('User requested fallback mode');
                  setMapError(true);
                }}
                className="block mx-auto text-xs text-blue-600 underline hover:text-blue-800 bg-white px-3 py-1 rounded"
              >
                Problème ? Cliquez ici pour la version alternative
              </button>
              <button 
                onClick={() => {
                  console.log('User requested page reload');
                  window.location.reload();
                }}
                className="block mx-auto text-xs text-gray-600 underline hover:text-gray-800"
              >
                Ou recharger la page
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Légende et zones d'opération */}
      <div className="absolute top-3 left-3 z-20 bg-background/90 backdrop-blur-sm border rounded-lg shadow px-4 py-3">
        <div className="text-sm font-bold text-foreground mb-2">Zones d'opération</div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span> Validés</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span> En attente</div>
          <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Rejetés</div>
          <div className="text-gray-600 mt-1">{filteredReports.length} rapports</div>
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
            console.log('Map ready successfully');
            setMapLoaded(true);
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
                  <p className="text-xs text-gray-600 mb-1 font-medium">
                    {locationNames[report.id] || 'Chargement...'}
                  </p>
                  {report.description && 
                   !report.description.includes('Signalement via Telegram') && 
                   report.description !== 'Signalement via bot Telegram' && (
                    <p className="text-xs mb-2">{report.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded ${
                      report.status === 'validated' ? 'bg-green-100 text-green-800' :
                      report.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status === 'validated' ? 'Validé' : 
                       report.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                    <span className="text-xs text-gray-500">
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
