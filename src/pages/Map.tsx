
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Loader2, Trophy, Award, Users, X } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<'reports' | 'leaderboard' | null>('leaderboard');
  
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary shadow-lg p-4 border-b border-primary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">🗺️ Carte Interactive</h1>
              <p className="text-primary-foreground/90 text-sm sm:text-base">Visualise et explore les signalements de la communauté</p>
            </div>
            <div className="bg-accent rounded-lg p-3 text-center self-start sm:self-auto">
              <div className="text-xl sm:text-2xl font-bold text-accent-foreground">{reports.length}</div>
              <div className="text-xs sm:text-sm text-accent-foreground/80">Signalements</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-2">
        {/* Layout avec carte très dominante */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
          
          {/* Carte principale - 5/6 de l'espace sur desktop */}
          <div className="xl:col-span-5">
            <Card className="bg-primary text-primary-foreground border-0 shadow-lg h-[70vh] xl:h-[calc(100vh-140px)]">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="flex items-center gap-2 text-primary-foreground text-lg">
                    <MapPin className="w-5 h-5 text-accent" />
                    Carte des Signalements
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      onClick={() => setFilter('all')}
                      className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 ${filter === 'all' ? 'ring-2 ring-accent-foreground' : ''}`}
                    >
                      Tous ({reports.length})
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setFilter('pending')}
                      className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 ${filter === 'pending' ? 'ring-2 ring-accent-foreground' : ''}`}
                    >
                      En attente ({reports.filter(r => r.status === 'pending').length})
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setFilter('validated')}
                      className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 ${filter === 'validated' ? 'ring-2 ring-accent-foreground' : ''}`}
                    >
                      Validés ({reports.filter(r => r.status === 'validated').length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)] p-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                      <p className="text-primary-foreground">Chargement de la carte...</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full rounded-lg overflow-hidden">
                    <OpenStreetMap
                      reports={reports}
                      selectedReport={selectedReport}
                      onReportSelect={setSelectedReport}
                      filter={filter}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel droit très compact - 1/6 de l'espace */}
          <div className="xl:col-span-1 space-y-3">
            
            {/* Top 3 Classement - Version compacte */}
            <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
              <CardHeader className="pb-2 py-3">
                <CardTitle className="flex items-center gap-2 text-primary-foreground text-base">
                  <Trophy className="w-4 h-4 text-accent" />
                  🏆 Top 3
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {leaderboard.slice(0, 3).map((user, index) => (
                  <div 
                    key={user.telegram_id} 
                    className="flex items-center gap-2 p-2 rounded-lg transition-all hover:shadow-md bg-accent text-accent-foreground hover:bg-accent/80"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-foreground text-accent font-bold text-sm">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-accent-foreground text-sm">{user.pseudo}</p>
                      <p className="text-xs text-accent-foreground/80">{user.points_himpact} pts</p>
                    </div>
                  </div>
                ))}
                
                {/* Bouton vers page classement complet */}
                <div className="pt-3 border-t border-primary-foreground/20">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/80"
                    onClick={() => window.location.href = '/classement'}
                  >
                    Voir le classement complet →
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Signalements récents - Version très compacte */}
            <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
              <CardHeader className="pb-2 py-3">
                <CardTitle className="flex items-center gap-2 text-primary-foreground text-base">
                  <Filter className="w-4 h-4 text-accent" />
                  📋 Récents
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-2">
                {isLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-4 text-primary-foreground/80">
                    <div className="w-8 h-8 mx-auto mb-2 bg-accent rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-accent-foreground" />
                    </div>
                    <p className="font-medium text-xs">Aucun signalement</p>
                  </div>
                ) : (
                  <>
                    {/* Afficher seulement les 2 plus récents */}
                    {filteredReports.slice(0, 2).map((report) => (
                      <div 
                        key={report.id}
                        className={`p-2 rounded-lg cursor-pointer transition-all hover:shadow-md bg-accent text-accent-foreground hover:bg-accent/80 ${
                          selectedReport?.id === report.id 
                            ? 'ring-2 ring-accent-foreground' 
                            : ''
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{getTypeIcon(report.type)}</span>
                          <div className="flex-1">
                            <p className="font-semibold text-accent-foreground text-xs">{report.user}</p>
                            <p className="text-xs text-accent-foreground/80 truncate">{report.location}</p>
                          </div>
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`}></div>
                        </div>
                        <p className="text-xs text-accent-foreground/80 line-clamp-1">{report.description}</p>
                      </div>
                    ))}
                    
                    {/* Bouton compact vers page signalements */}
                    <div className="pt-2 border-t border-primary-foreground/20">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/80 text-xs py-2"
                        onClick={() => window.location.href = '/signalements'}
                      >
                        Voir tous →
                      </Button>
                    </div>
                  </>
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
