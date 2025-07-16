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
      {/* Header Gaming Style */}
      <div className="bg-primary shadow-lg p-4 border-b-2 border-accent/50">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1 flex items-center gap-2">
                🗺️ <span className="text-accent">CARTE</span> INTERACTIVE
              </h1>
              <p className="text-primary-foreground/90 text-sm sm:text-base">Mission : Explorer et signaler les zones polluées</p>
            </div>
            <div className="bg-accent rounded-lg p-3 text-center border-2 border-accent-foreground/30 shadow-lg">
              <div className="text-xl sm:text-2xl font-bold text-accent-foreground">{reports.length}</div>
              <div className="text-xs sm:text-sm text-accent-foreground/80">SIGNALEMENTS</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto h-[calc(100vh-120px)]">
        {/* Layout Gaming - Carte plein écran avec HUD flottant */}
        <div className="relative h-full">
          
          {/* Carte principale plein écran */}
          <Card className="bg-primary text-primary-foreground border-2 border-accent/50 shadow-2xl h-full w-full">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="flex items-center gap-2 text-primary-foreground text-lg">
                  <MapPin className="w-5 h-5 text-accent animate-pulse" />
                  <span className="text-accent">ZONE DE COMBAT</span> ENVIRONNEMENTAL
                </CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => setFilter('all')}
                    className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 border border-accent-foreground/30 font-bold ${filter === 'all' ? 'ring-2 ring-accent-foreground shadow-lg' : ''}`}
                  >
                    TOUS ({reports.length})
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setFilter('pending')}
                    className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 border border-accent-foreground/30 font-bold ${filter === 'pending' ? 'ring-2 ring-accent-foreground shadow-lg' : ''}`}
                  >
                    ATTENTE ({reports.filter(r => r.status === 'pending').length})
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => setFilter('validated')}
                    className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 border border-accent-foreground/30 font-bold ${filter === 'validated' ? 'ring-2 ring-accent-foreground shadow-lg' : ''}`}
                  >
                    VALIDÉS ({reports.filter(r => r.status === 'validated').length})
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] p-0 relative">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                    <p className="text-primary-foreground font-bold">CHARGEMENT DE LA ZONE...</p>
                  </div>
                </div>
              ) : (
                <div className="h-full w-full">
                  <OpenStreetMap
                    reports={reports}
                    selectedReport={selectedReport}
                    onReportSelect={setSelectedReport}
                    filter={filter}
                  />
                </div>
              )}

              {/* HUD Gaming - Panels flottants sur la droite */}
              <div className="absolute top-4 right-4 space-y-4 w-80 hidden lg:block">
                
                {/* Leaderboard HUD */}
                <div className="bg-primary/95 backdrop-blur-sm border-2 border-accent/60 rounded-lg shadow-2xl p-4 relative overflow-hidden">
                  {/* Effet néon */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 border-b border-accent/40 pb-2">
                      <Trophy className="w-5 h-5 text-accent animate-pulse" />
                      <h3 className="text-accent font-bold text-lg tracking-wider">🏆 TOP HÉROS</h3>
                    </div>
                    <div className="space-y-2">
                      {leaderboard.slice(0, 3).map((user, index) => (
                        <div 
                          key={user.telegram_id} 
                          className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-accent/40 hover:bg-accent/30 transition-all hover:scale-105"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold text-lg border-2 border-accent-foreground shadow-lg">
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-primary-foreground text-sm tracking-wide">{user.pseudo}</p>
                            <p className="text-xs text-accent font-bold">{user.points_himpact} PTS HIMPACT</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-primary-foreground/80">RANG #{index + 1}</div>
                            <div className="text-xs text-accent">{user.reports_count || 0} missions</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-accent text-accent-foreground hover:bg-accent/80 border-2 border-accent-foreground/20 font-bold text-sm tracking-wider hover:scale-105 transition-transform"
                      onClick={() => window.location.href = '/classement'}
                    >
                      ⚡ HALL OF FAME ⚡
                    </Button>
                  </div>
                </div>

                {/* Activité récente HUD */}
                <div className="bg-primary/95 backdrop-blur-sm border-2 border-accent/60 rounded-lg shadow-2xl p-4 relative overflow-hidden">
                  {/* Effet néon */}
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg"></div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3 border-b border-accent/40 pb-2">
                      <Filter className="w-5 h-5 text-accent animate-pulse" />
                      <h3 className="text-accent font-bold text-lg tracking-wider">📡 ACTIVITÉ LIVE</h3>
                    </div>
                    
                    {isLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Loader2 className="w-5 h-5 animate-spin text-accent" />
                      </div>
                    ) : filteredReports.length === 0 ? (
                      <div className="text-center py-4 text-primary-foreground/80">
                        <div className="w-12 h-12 mx-auto mb-2 bg-accent/20 rounded-full flex items-center justify-center border-2 border-accent/40">
                          <MapPin className="w-6 h-6 text-accent" />
                        </div>
                        <p className="font-bold text-xs tracking-wider">ZONE CALME</p>
                        <p className="text-xs text-accent">En attente de missions...</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredReports.slice(0, 3).map((report) => (
                          <div 
                            key={report.id}
                            className={`p-3 rounded-lg cursor-pointer transition-all bg-accent/20 border border-accent/40 hover:bg-accent/30 hover:scale-105 ${
                              selectedReport?.id === report.id 
                                ? 'ring-2 ring-accent bg-accent/40 shadow-lg' 
                                : ''
                            }`}
                            onClick={() => setSelectedReport(report)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xl">{getTypeIcon(report.type)}</span>
                              <div className="flex-1">
                                <p className="font-bold text-primary-foreground text-sm tracking-wide">{report.user}</p>
                                <p className="text-xs text-accent truncate">{report.location}</p>
                              </div>
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)} animate-pulse border border-white/50`}></div>
                            </div>
                            <p className="text-xs text-primary-foreground/80 line-clamp-2 leading-relaxed">{report.description}</p>
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-accent/20">
                              <div className="text-xs text-accent/80 font-bold">
                                {new Date(report.date).toLocaleDateString('fr-FR', { 
                                  day: '2-digit', 
                                  month: 'short'
                                })}
                              </div>
                              <Badge className="text-xs bg-accent text-accent-foreground border border-accent-foreground/30">
                                {report.status === 'validated' ? 'COMPLÉTÉ' : 
                                 report.status === 'rejected' ? 'ÉCHOUÉ' : 'EN COURS'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3 bg-accent text-accent-foreground hover:bg-accent/80 border-2 border-accent-foreground/20 font-bold text-sm tracking-wider hover:scale-105 transition-transform"
                      onClick={() => window.location.href = '/signalements'}
                    >
                      🚀 JOURNAL DES MISSIONS 🚀
                    </Button>
                  </div>
                </div>
              </div>

              {/* Version mobile - Boutons flottants en bas avec style gaming */}
              <div className="absolute bottom-4 right-4 lg:hidden flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-accent text-accent-foreground hover:bg-accent/80 shadow-xl border-2 border-accent-foreground/30 font-bold"
                  onClick={() => window.location.href = '/classement'}
                >
                  🏆
                </Button>
                <Button 
                  size="sm" 
                  className="bg-accent text-accent-foreground hover:bg-accent/80 shadow-xl border-2 border-accent-foreground/30 font-bold"
                  onClick={() => window.location.href = '/signalements'}
                >
                  📡
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Map;