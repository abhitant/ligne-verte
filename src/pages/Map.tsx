
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Loader2, Camera, Zap, Trophy, Target, Users } from "lucide-react";
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

  console.log('Map component - Reports:', reports);
  console.log('Map component - Current filter:', filter);

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  console.log('Map component - Filtered reports:', filteredReports);

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
    console.error('Map component error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-green-800 mb-2">🗺️ Carte des Missions</h1>
            <p className="text-lg text-gray-600">Découvre les zones à améliorer près de chez toi</p>
          </div>
          <Card className="bg-white shadow-lg">
            <CardContent className="p-6">
              <div className="text-center text-red-600">
                <p className="text-lg font-semibold mb-2">Erreur lors du chargement des signalements</p>
                <p className="text-sm">Vérifiez votre connexion internet et réessayez.</p>
                <p className="text-xs mt-2 text-gray-500">Détails: {error.message}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header avec Navigation */}
      <div className="bg-white shadow-sm border-b border-green-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-green-800 mb-1">🗺️ Carte des Missions</h1>
              <p className="text-gray-600">Découvre les zones à améliorer près de chez toi</p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Camera className="w-4 h-4 mr-2" />
                Nouvelle Mission
              </Button>
            </div>
          </div>

          {/* Stats Rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{reports.length}</div>
              <div className="text-xs text-green-700">Zones Signalées</div>
            </div>
            <div className="bg-yellow-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'pending').length}
              </div>
              <div className="text-xs text-yellow-700">En Attente</div>
            </div>
            <div className="bg-blue-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {reports.filter(r => r.status === 'validated').length}
              </div>
              <div className="text-xs text-blue-700">Validées</div>
            </div>
            <div className="bg-purple-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">+50</div>
              <div className="text-xs text-purple-700">Points Possibles</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte Interactive */}
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
                      className={filter === 'all' ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      Tous ({reports.length})
                    </Button>
                    <Button
                      variant={filter === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('pending')}
                      className={filter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                    >
                      En attente ({reports.filter(r => r.status === 'pending').length})
                    </Button>
                    <Button
                      variant={filter === 'validated' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('validated')}
                      className={filter === 'validated' ? 'bg-blue-600 hover:bg-blue-700' : ''}
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
                      <p className="text-gray-600">Chargement des missions...</p>
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

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Missions Disponibles */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Missions Près de Toi
                </CardTitle>
                <CardDescription className="text-green-100">
                  Gagne des points en participant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">📸 Signaler Zone</span>
                      <Badge className="bg-white/30 text-white">+50 pts</Badge>
                    </div>
                    <p className="text-sm text-green-100">Prends une photo d'une zone insalubre</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">✅ Vérifier</span>
                      <Badge className="bg-white/30 text-white">+30 pts</Badge>
                    </div>
                    <p className="text-sm text-green-100">Confirme l'état d'une zone</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">🧹 Nettoyer</span>
                      <Badge className="bg-white/30 text-white">+200 pts</Badge>
                    </div>
                    <p className="text-sm text-green-100">Organise une action de nettoyage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liste des Signalements */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-blue-600" />
                  Signalements ({filteredReports.length})
                </CardTitle>
                <CardDescription>
                  {isLoading ? 'Chargement...' : 'Clique pour voir sur la carte'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucun signalement trouvé</p>
                    <p className="text-sm mt-2">
                      {filter !== 'all' ? 'Essayez de changer le filtre.' : 'Sois le premier à signaler !'}
                    </p>
                    {reports.length > 0 && filter !== 'all' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                        onClick={() => setFilter('all')}
                      >
                        Voir tous les signalements
                      </Button>
                    )}
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
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                          {report.status === 'pending' && (
                            <Badge variant="secondary" className="text-xs">+50 pts</Badge>
                          )}
                        </div>
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

            {/* Légende et Classement */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Top Contributeurs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥇</span>
                    <span className="font-medium text-sm">Aminata T.</span>
                  </div>
                  <span className="text-sm font-bold text-yellow-600">1,250 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥈</span>
                    <span className="font-medium text-sm">Kouassi M.</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">980 pts</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🥉</span>
                    <span className="font-medium text-sm">Fatou D.</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">875 pts</span>
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
