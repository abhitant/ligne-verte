
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
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

const OpenStreetMap = ({ reports, selectedReport, onReportSelect, filter }: OpenStreetMapProps) => {
  // Center sur Abidjan
  const center: [number, number] = [5.3478, -4.0267];

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

  return (
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
  );
};

export default OpenStreetMap;
