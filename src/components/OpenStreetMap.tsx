
import { useEffect, useRef, useState } from 'react';

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
  // Filtrer les rapports selon le filtre actuel
  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  console.log('OpenStreetMap rendered with', filteredReports.length, 'reports');

  return (
    <div className="h-full w-full bg-gradient-to-br from-green-50 to-blue-50 flex flex-col items-center justify-start p-4 rounded-lg border-2 border-green-200 overflow-y-auto">
      <div className="text-center mb-4 w-full">
        <h3 className="text-xl font-bold text-green-800 mb-2">🗺️ Carte des Signalements</h3>
        <div className="bg-white rounded-lg p-3 shadow-sm border border-green-200 mb-4">
          <p className="text-green-600 text-sm font-medium">Zone d'Abidjan - Côte d'Ivoire</p>
          <p className="text-green-500 text-lg font-bold">{filteredReports.length} signalement(s)</p>
          {filter !== 'all' && (
            <p className="text-xs text-gray-500 mt-1">
              Filtre: {filter === 'pending' ? 'En attente' : 'Validés'}
            </p>
          )}
        </div>
      </div>
      
      <div className="w-full max-w-2xl space-y-3">
        {filteredReports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-green-200">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-500 text-lg font-medium">Aucun signalement trouvé</p>
            <p className="text-gray-400 text-sm mt-2">
              {filter !== 'all' 
                ? 'Essayez de changer le filtre pour voir d\'autres signalements.' 
                : 'Soyez le premier à signaler un problème environnemental !'}
            </p>
          </div>
        ) : (
          filteredReports.map((report, index) => (
            <div
              key={report.id}
              className={`p-4 bg-white rounded-lg shadow-sm border-2 cursor-pointer transition-all hover:shadow-md hover:border-green-300 ${
                selectedReport?.id === report.id ? 'ring-2 ring-green-500 border-green-500 bg-green-50' : 'border-gray-200'
              }`}
              onClick={() => onReportSelect(report)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">
                    {report.type === 'waste' ? '🗑️' : report.type === 'drain' ? '🚰' : '⚠️'}
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 text-base">{report.user}</span>
                    <p className="text-sm text-gray-500">{report.location}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`w-4 h-4 rounded-full ${
                    report.status === 'validated' ? 'bg-green-500' :
                    report.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-xs text-gray-400">#{index + 1}</span>
                </div>
              </div>
              
              <p className="text-gray-700 text-sm mb-3 leading-relaxed">{report.description}</p>
              
              <div className="flex items-center justify-between">
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  report.status === 'validated' ? 'bg-green-100 text-green-800 border border-green-200' :
                  report.status === 'rejected' ? 'bg-red-100 text-red-800 border border-red-200' :
                  'bg-yellow-100 text-yellow-800 border border-yellow-200'
                }`}>
                  {report.status === 'validated' ? '✅ Validé' : 
                   report.status === 'rejected' ? '❌ Rejeté' : '⏳ En attente'}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {new Date(report.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="mt-3 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs text-blue-700 font-mono">
                  📍 {report.coordinates.lat.toFixed(6)}, {report.coordinates.lng.toFixed(6)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-6 text-center w-full">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
          <p className="text-xs text-gray-500 mb-2">
            💡 Interface optimisée pour mobile et Telegram
          </p>
          <div className="flex justify-center items-center gap-4 text-xs text-gray-400">
            <span>🌱 La Ligne Verte</span>
            <span>•</span>
            <span>Communauté Écologique</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenStreetMap;
