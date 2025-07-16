
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
      {/* Header Simplifié */}
      <div className="bg-primary shadow-lg p-4 border-b-2 border-primary/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground mb-1">🗺️ Carte Interactive</h1>
              <p className="text-primary-foreground/90">Visualise et explore les signalements de la communauté</p>
            </div>
            <div className="bg-accent rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-accent-foreground">{reports.length}</div>
              <div className="text-sm text-accent-foreground/80">Signalements</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
          {/* Carte - 2/3 de l'espace */}
          <div className="lg:col-span-2 relative">
            <Card className="h-full shadow-xl border-2 border-primary/20 bg-gradient-to-br from-background to-accent/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    Carte des Signalements
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={filter === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('all')}
                      className={`text-sm ${filter === 'all' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}`}
                    >
                      Tous ({reports.length})
                    </Button>
                    <Button
                      variant={filter === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('pending')}
                      className={`text-sm ${filter === 'pending' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}`}
                    >
                      En attente ({reports.filter(r => r.status === 'pending').length})
                    </Button>
                    <Button
                      variant={filter === 'validated' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setFilter('validated')}
                      className={`text-sm ${filter === 'validated' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}`}
                    >
                      Validés ({reports.filter(r => r.status === 'validated').length})
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)] p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                      <p className="text-muted-foreground text-lg">Chargement de la carte...</p>
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

          {/* Panel Droit - 1/3 de l'espace */}
          <div className="space-y-6">
            {/* Classement */}
            <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  🏆 Classement
                </CardTitle>
                <CardDescription>
                  Les champions de l'environnement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                {leaderboard.slice(0, 10).map((user, index) => (
                  <div 
                    key={user.telegram_id} 
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all hover:shadow-md ${
                      index < 3 
                        ? 'bg-accent text-accent-foreground border border-accent/30' 
                        : 'bg-card hover:bg-accent/10'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                      index < 3 ? 'bg-accent-foreground text-accent' : 'bg-accent text-accent-foreground'
                    }`}>
                      {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{user.pseudo}</p>
                      <p className="text-sm text-muted-foreground">{user.reports_count || 0} signalements</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary text-lg">{user.points_himpact}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Signalements Récents */}
            <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Filter className="w-5 h-5 text-primary" />
                  Signalements
                  <Badge variant="secondary" className="ml-2">
                    {filteredReports.length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Explorez les signalements de la communauté
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <div className="w-16 h-16 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium">Aucun signalement trouvé</p>
                    <p className="text-sm mt-2">
                      {filter !== 'all' ? 'Essayez de changer le filtre.' : 'En attente des premiers signalements...'}
                    </p>
                    {reports.length > 0 && filter !== 'all' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
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
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md animate-fade-in ${
                        selectedReport?.id === report.id 
                          ? 'ring-2 ring-primary bg-primary/5 border-primary' 
                          : 'bg-card hover:bg-accent/10 border-border'
                      }`}
                      onClick={() => setSelectedReport(report)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTypeIcon(report.type)}</span>
                          <div>
                            <p className="font-semibold text-foreground">{report.user}</p>
                            <p className="text-sm text-muted-foreground">{report.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                          <Badge variant={report.status === 'validated' ? 'default' : 'secondary'} className="text-xs">
                            {report.status === 'validated' ? 'Validé' : 
                             report.status === 'rejected' ? 'Rejeté' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {new Date(report.date).toLocaleDateString('fr-FR', { 
                            day: '2-digit', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <Button size="sm" variant="ghost" className="h-8 px-3 hover-scale bg-accent text-accent-foreground hover:bg-accent/80">
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Button>
                      </div>
                    </div>
                  ))
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
