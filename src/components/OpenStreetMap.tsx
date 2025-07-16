
import { useEffect, useRef, useState } from 'react';
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
}

interface OpenStreetMapProps {
  reports: MapReport[];
  selectedReport: MapReport | null;
  onReportSelect: (report: MapReport) => void;
  filter: 'all' | 'pending' | 'validated';
}

// Composant de fallback simple pour les cas où Leaflet ne fonctionne pas
const SimpleFallbackMap = ({ reports, selectedReport, onReportSelect, filter }: OpenStreetMapProps) => {
  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  return (
    <div className="h-full w-full bg-green-50 flex flex-col items-center justify-center p-4 rounded-lg border-2 border-green-200">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-green-800 mb-2">🗺️ Carte des Signalements</h3>
        <p className="text-green-600 text-sm">Zone d'Abidjan - {filteredReports.length} signalement(s)</p>
      </div>
      
      <div className="w-full max-w-md space-y-2 max-h-96 overflow-y-auto">
        {filteredReports.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun signalement trouvé</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className={`p-3 bg-white rounded-lg shadow-sm border cursor-pointer transition-all hover:shadow-md ${
                selectedReport?.id === report.id ? 'ring-2 ring-green-500' : ''
              }`}
              onClick={() => onReportSelect(report)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {report.type === 'waste' ? '🗑️' : report.type === 'drain' ? '🚰' : '⚠️'}
                  </span>
                  <span className="font-medium text-sm">{report.user}</span>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  report.status === 'validated' ? 'bg-green-500' :
                  report.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                }`}></div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{report.location}</p>
              <p className="text-xs text-gray-500 line-clamp-2">{report.description}</p>
              <div className="flex items-center justify-between mt-2">
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
          ))
        )}
      </div>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          💡 Version simplifiée pour compatibilité mobile
        </p>
      </div>
    </div>
  );
};

const OpenStreetMap = ({ reports, selectedReport, onReportSelect, filter }: OpenStreetMapProps) => {
  const [useSimpleMap, setUseSimpleMap] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Center sur Abidjan
  const center: [number, number] = [5.3478, -4.0267];

  // Forcer l'utilisation de la carte simple pour tous les cas (compatibilité maximale)
  useEffect(() => {
    // Toujours utiliser la carte simple pour une meilleure compatibilité
    console.log('Utilisation de la carte simple pour compatibilité maximale');
    setUseSimpleMap(true);
  }, []);

  // Filtrer les rapports selon le filtre actuel
  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  // Créer des icônes personnalisées selon le statut
  const createCustomIcon = (status: string) => {
    const color = status === 'validated' ? 'green' : status === 'rejected' ? 'red' : 'orange';
    return new Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  };

  // Si on utilise la carte simple ou si la carte interactive ne charge pas
  if (useSimpleMap) {
    return <SimpleFallbackMap reports={reports} selectedReport={selectedReport} onReportSelect={onReportSelect} filter={filter} />;
  }

  return (
    <div className="relative h-full w-full">
      {!mapLoaded && (
        <div className="absolute inset-0 bg-green-50 flex items-center justify-center z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
            <p className="text-green-600">Chargement de la carte...</p>
            <button 
              onClick={() => setUseSimpleMap(true)}
              className="mt-2 text-xs text-blue-600 underline"
            >
              Utiliser la version simplifiée
            </button>
          </div>
        </div>
      )}
      
      <MapContainer 
        center={center} 
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {filteredReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.coordinates.lat, report.coordinates.lng]}
            icon={createCustomIcon(report.status)}
            eventHandlers={{
              click: () => onReportSelect(report)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-sm mb-1">{report.user}</h3>
                <p className="text-xs text-gray-600 mb-1">{report.location}</p>
                <p className="text-xs mb-2">{report.description}</p>
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
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default OpenStreetMap;
