
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Loader2, Trophy, Award, Users } from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";
import { useReports } from "@/hooks/useReports";
import Leaderboard from "@/components/gamification/Leaderboard";
import { useLeaderboard } from "@/hooks/useGamification";
import { wasteTypes } from "@/components/gamification/WasteTypeSelector";

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
  const [activeTab, setActiveTab] = useState<'reports' | 'leaderboard' | null>(null);
  
  const { data: reports = [], isLoading, error } = useReports();
  const { data: leaderboard = [] } = useLeaderboard(10);

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
            <h1 className="text-4xl font-bold text-green-800 mb-2">🗺️ Carte des Signalements</h1>
            <p className="text-lg text-gray-600">Découvre les zones signalées par la communauté</p>
          </div>
          <Card className="bg-card shadow-lg">
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
    <div className="min-h-screen bg-primary">
      {/* Header avec Navigation */}
      <div className="bg-primary shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">🗺️ Carte des Signalements</h1>
              <p className="text-white/90">Découvre les zones signalées par la communauté</p>
            </div>
          </div>

          {/* Stats Rapides - Seulement le nombre total */}
          <div className="flex justify-center mb-4">
            <div className="bg-accent rounded-lg p-4 text-center min-w-[200px]">
              <div className="text-3xl font-bold text-accent-foreground">{reports.length}</div>
              <div className="text-sm text-accent-foreground/80">Signalements</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-2">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Carte Interactive - Prend maintenant beaucoup plus de place */}
          <div className="xl:col-span-3">
            <Card className="bg-primary/90 shadow-xl h-[calc(100vh-200px)] min-h-[700px] border-2 border-primary relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary)) 100%)'
                  }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-primary-foreground">
                    <MapPin className="w-5 h-5 text-accent" />
                    Carte Interactive
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        console.log('Clicking pending filter');
                        setFilter('pending');
                      }}
                      className="bg-accent text-accent-foreground hover:bg-accent/80"
                    >
                      En attente ({reports.filter(r => r.status === 'pending').length})
                    </Button>
                    <Button
                      variant={filter === 'validated' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('validated')}
                      className="bg-accent text-accent-foreground hover:bg-accent/80"
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

          {/* Sidebar Compact Gamifié */}
          <div className="space-y-4">
            {/* Navigation Tabs */}
            <Card className="bg-primary/80 shadow-xl border-2 border-primary">
              <CardHeader className="pb-2">
                <div className="flex flex-col gap-2">
                  <Button
                    size="sm"
                    onClick={() => setActiveTab(activeTab === 'reports' ? null : 'reports')}
                    className="flex items-center gap-2 w-full justify-start bg-accent text-accent-foreground hover:bg-accent/80"
                  >
                    <Filter className="w-4 h-4" />
                    Signalements ({filteredReports.length})
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab(activeTab === 'leaderboard' ? null : 'leaderboard')}
                    className="flex items-center gap-2 w-full justify-start bg-accent text-accent-foreground hover:bg-accent/80"
                  >
                    <Trophy className="w-4 h-4" />
                    🏆 Classement
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="max-h-[calc(100vh-350px)] overflow-y-auto text-primary-foreground">
                {activeTab === null ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Sélectionnez une section ci-dessus</p>
                  </div>
                ) : activeTab === 'reports' ? (
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                      </div>
                    ) : filteredReports.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Aucun signalement trouvé</p>
                        <p className="text-sm mt-2">
                          {filter !== 'all' ? 'Essayez de changer le filtre.' : 'En attente des premiers signalements...'}
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
                          className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md bg-card ${
                            selectedReport?.id === report.id ? 'ring-2 ring-green-500 bg-green-50' : 'hover:bg-card/80'
                          }`}
                          onClick={() => setSelectedReport(report)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{getTypeIcon(report.type)}</span>
                              <span className="font-medium text-sm text-card-foreground">{report.user}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{report.location}</p>
                          <p className="text-xs text-muted-foreground line-clamp-2">{report.description}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {new Date(report.date).toLocaleDateString('fr-FR')}
                            </span>
                            <Button size="sm" variant="ghost" className="h-6 px-2">
                              <Eye className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Leaderboard 
                      users={leaderboard} 
                      currentUserId={undefined}
                      limit={10}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;
