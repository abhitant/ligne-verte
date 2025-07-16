import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Loader2, Trophy, Award, Users, X, ChevronDown, ChevronUp } from "lucide-react";
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
  const [isHUDOpen, setIsHUDOpen] = useState(true);
  
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
    <div className="h-screen bg-background overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Card wrapper gaming style */}
        <Card className="bg-primary text-primary-foreground border-2 border-accent/50 shadow-2xl h-full w-full rounded-none flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-primary-foreground text-lg">
                <MapPin className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-accent font-bold tracking-wider">URGENCE ENVIRONNEMENTALE SIGNALÉ ({reports.length})</span>
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setFilter('pending')}
                  className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 border border-accent-foreground/30 font-bold tracking-wide ${filter === 'pending' ? 'ring-2 ring-accent-foreground shadow-lg' : ''}`}
                >
                  ATTENTE ({reports.filter(r => r.status === 'pending').length})
                </Button>
                <Button
                  size="sm"
                  onClick={() => setFilter('validated')}
                  className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 border border-accent-foreground/30 font-bold tracking-wide ${filter === 'validated' ? 'ring-2 ring-accent-foreground shadow-lg' : ''}`}
                >
                  VALIDÉS ({reports.filter(r => r.status === 'validated').length})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                  <p className="text-primary-foreground font-bold">CHARGEMENT DE LA ZONE...</p>
                </div>
              </div>
            ) : (
              <div className="h-full w-full relative">
                <OpenStreetMap
                  reports={reports}
                  selectedReport={selectedReport}
                  onReportSelect={setSelectedReport}
                  filter={filter}
                />
                
                {/* HUD overlay permanent sur la carte */}
                <div className="absolute top-2 right-2 lg:top-4 lg:right-4 space-y-3 w-60 lg:w-72 pointer-events-auto z-[1000]">
                  
                  {/* Statistiques compactes HUD */}
                  <div className="bg-primary/80 backdrop-blur-sm border-2 border-accent/60 rounded-lg shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg"></div>
                    
                    {/* Header avec bouton toggle */}
                    <div className="relative z-10 p-3 border-b border-accent/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-accent" />
                          <h3 className="text-accent font-bold text-sm tracking-wider">STATS</h3>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 hover:bg-accent/20"
                          onClick={() => setIsHUDOpen(!isHUDOpen)}
                        >
                          {isHUDOpen ? (
                            <ChevronUp className="w-4 h-4 text-accent" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-accent" />
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Contenu pliable */}
                    {isHUDOpen && (
                      <div className="relative z-10 p-3 space-y-3">
                        
                        {/* Top 3 Compact */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-4 h-4 text-accent" />
                            <h3 className="text-accent font-bold text-sm tracking-wider">TOP 3</h3>
                          </div>
                          <div className="space-y-1">
                            {leaderboard.slice(0, 3).map((user, index) => (
                              <div key={user.telegram_id} className="flex items-center gap-2 text-xs">
                                <span className="text-sm">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                                <span className="text-primary-foreground font-medium flex-1 truncate">{user.pseudo}</span>
                                <span className="text-accent font-bold">{user.points_himpact}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-accent/30 pt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Filter className="w-4 h-4 text-accent" />
                            <h3 className="text-accent font-bold text-sm tracking-wider">RÉCENTS</h3>
                          </div>
                          {filteredReports.length === 0 ? (
                            <div className="text-center py-2">
                              <p className="text-xs text-primary-foreground/80">Zone calme</p>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              {filteredReports.slice(0, 2).map((report) => (
                                <div 
                                  key={report.id}
                                  className={`p-2 rounded cursor-pointer text-xs transition-all bg-accent/10 hover:bg-accent/20 ${
                                    selectedReport?.id === report.id ? 'ring-1 ring-accent' : ''
                                  }`}
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{getTypeIcon(report.type)}</span>
                                    <span className="text-primary-foreground font-medium flex-1 truncate">{report.user}</span>
                                    <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-accent/80 text-accent-foreground hover:bg-accent text-xs py-1 h-7"
                            onClick={() => window.location.href = '/classement'}
                          >
                            Classement
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-accent/80 text-accent-foreground hover:bg-accent text-xs py-1 h-7"
                            onClick={() => window.location.href = '/signalements'}
                          >
                            Signalements
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Map;