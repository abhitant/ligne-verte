
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Eye, Loader2 } from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";
import { useReports } from "@/hooks/useReports";

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

const Map = () => {
  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');
  
  const { data: reports = [], isLoading, error } = useReports();

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'waste': return '🗑️';
      case 'drain': return '🚰';
      default: return '⚠️';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">🗺️ Carte des Signalements</h1>
            <p className="text-lg text-gray-600">Visualisez tous les signalements d'Abidjan</p>
          </div>
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <p className="text-lg font-semibold mb-2">Erreur lors du chargement des signalements</p>
                <p className="text-sm">Vérifiez votre connexion internet et réessayez.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🗺️ Carte des Signalements</h1>
          <p className="text-lg text-gray-600">Visualisez tous les signalements d'Abidjan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map with OpenStreetMap */}
          <div className="lg:col-span-2">
            <Card className="bg-white shadow-lg h-[600px]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Carte Interactive
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                    >
                      Tous ({reports.length})
                    </Button>
                    <Button
                      variant={filter === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('pending')}
                    >
                      En attente ({reports.filter(r => r.status === 'pending').length})
                    </Button>
                    <Button
                      variant={filter === 'validated' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('validated')}
                    >
                      Validés ({reports.filter(r => r.status === 'validated').length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-green-600" />
                      <p className="text-gray-600">Chargement des signalements...</p>
                    </div>
                  </div>
                ) : (
                  <OpenStreetMap
                    reports={reports}
                    selectedReport={selectedReport}
                    onReportSelect={setSelectedReport}
                    filter={filter}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar with reports */}
          <div className="space-y-4">
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  Signalements ({filteredReports.length})
                </CardTitle>
                <CardDescription>
                  {isLoading ? 'Chargement...' : 'Cliquez pour voir sur la carte'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun signalement trouvé</p>
                    <p className="text-sm mt-2">
                      {filter !== 'all' ? 'Essayez de changer le filtre.' : 'Les signalements apparaîtront ici.'}
                    </p>
                  </div>
                ) : (
                  filteredReports.map((report) => (
                    <div 
                      key={report.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedReport?.id === report.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(report.type)}</span>
                          <span className="font-medium text-sm">{report.user}</span>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{report.location}</p>
                      <p className="text-xs text-gray-500 line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {new Date(report.date).toLocaleDateString('fr-FR')}
                        </span>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Légende</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">En attente</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Validé</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Rejeté</span>
                </div>
              </CardContent>
            </Card>

            {/* Call to action */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
              <CardContent className="p-4 text-center">
                <h3 className="font-bold mb-2">Signaler une zone insalubre</h3>
                <p className="text-sm mb-3 opacity-90">
                  Utilisez notre bot Telegram pour signaler
                </p>
                <Button 
                  variant="outline" 
                  className="bg-white text-green-600 hover:bg-gray-100 w-full"
                >
                  <a 
                    href="https://t.me/LigneVerteBot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full"
                  >
                    Ouvrir le Bot
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
