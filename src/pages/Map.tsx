import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Filter, Eye } from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";

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

  const reports: MapReport[] = [
    {
      id: '1',
      user: 'Kouame Jean',
      location: 'Cocody, Abidjan',
      coordinates: { lat: 5.3478, lng: -4.0267 },
      description: 'Poubelles sauvages près du marché',
      status: 'pending',
      date: '2024-01-15',
      type: 'waste'
    },
    {
      id: '2',
      user: 'Aminata Traoré',
      location: 'Yopougon, Abidjan',
      coordinates: { lat: 5.3364, lng: -4.0854 },
      description: 'Caniveau bouché devant école',
      status: 'validated',
      date: '2024-01-14',
      type: 'drain'
    },
    {
      id: '3',
      user: 'Ibrahim Diallo',
      location: 'Adjamé, Abidjan',
      coordinates: { lat: 5.3600, lng: -4.0100 },
      description: 'Déchets plastiques sur le trottoir',
      status: 'pending',
      date: '2024-01-13',
      type: 'waste'
    }
  ];

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
                      Tous
                    </Button>
                    <Button
                      variant={filter === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('pending')}
                    >
                      En attente
                    </Button>
                    <Button
                      variant={filter === 'validated' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('validated')}
                    >
                      Validés
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full p-2">
                <OpenStreetMap
                  reports={reports}
                  selectedReport={selectedReport}
                  onReportSelect={setSelectedReport}
                  filter={filter}
                />
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
                  Cliquez pour voir sur la carte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[500px] overflow-y-auto">
                {filteredReports.map((report) => (
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
                ))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
