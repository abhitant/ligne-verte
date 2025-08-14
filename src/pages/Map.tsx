import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Loader2, Trophy, Award, Users, X, ChevronDown, ChevronUp, User, RefreshCw } from "lucide-react";
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
  photo_url?: string;
}

const Map = () => {
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState<MapReport | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');
  const [activeTab, setActiveTab] = useState<'reports' | 'leaderboard' | null>('leaderboard');
  const [isHUDOpen, setIsHUDOpen] = useState(true);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showReportDetails, setShowReportDetails] = useState(false);
  
  const { data: reports = [], isLoading, error, refetch } = useReports();
  const { data: leaderboard = [] } = useLeaderboard(10);

  console.log('Map component - Reports:', reports);
  console.log('Map component - Current filter:', filter);
  console.log('Map component - Loading state:', isLoading);
  console.log('Map component - Error state:', error);

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  console.log('Map component - Filtered reports:', filteredReports);

  // Debug pour l'overlay quand un signalement est sélectionné
  useEffect(() => {
    if (selectedReport) {
      console.log('Selected report data:', selectedReport);
      console.log('Selected report photo_url:', selectedReport.photo_url);
      console.log('Photo URL exists:', !!selectedReport.photo_url);
    }
  }, [selectedReport]);

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
                <p className="text-sm mb-4">Vérifiez votre connexion internet et réessayez.</p>
                <Button 
                  onClick={() => {
                    console.log('Retrying reports fetch...');
                    refetch();
                  }}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réessayer
                </Button>
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
              <CardTitle className="flex items-center gap-2 text-primary-foreground text-base sm:text-lg flex-shrink-0">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent animate-pulse" />
                <span className="text-accent font-bold tracking-wider text-sm sm:text-base">ZONES D'INTERVENTION</span>
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={`text-xs sm:text-sm bg-accent text-accent-foreground hover:bg-accent/80 border border-accent-foreground/30 font-bold tracking-wide ${filter === 'all' ? 'ring-2 ring-accent-foreground shadow-lg' : ''}`}
                >
                  SIGNALÉS ({reports.length})
                </Button>
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
                  <Button 
                    onClick={() => {
                      console.log('Force reload requested...');
                      window.location.reload();
                    }}
                    variant="ghost"
                    className="mt-4 text-xs text-accent hover:bg-accent/20"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Recharger la page
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full w-full relative">
                <OpenStreetMap
                  reports={reports}
                  selectedReport={selectedReport}
                  onReportSelect={(report) => {
                    setSelectedReport(report);
                    setShowReportDetails(true);
                  }}
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
                               <div key={user.pseudo + user.rank} className="flex items-center gap-2 text-xs">
                                 <span className="text-sm">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                                 <User className="w-3 h-3 text-accent" />
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
                                   onClick={() => {
                                     setSelectedReport(report);
                                     setShowReportDetails(true);
                                   }}
                                >
                                   <div className="flex items-center gap-2">
                                     <span>{getTypeIcon(report.type)}</span>
                                     <User className="w-3 h-3 text-accent" />
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
                            onClick={() => setShowLeaderboard(true)}
                          >
                            Classement
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-accent/80 text-accent-foreground hover:bg-accent text-xs py-1 h-7"
                            onClick={() => setShowReports(true)}
                          >
                            Signalements
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Overlay Classement complet */}
                {showLeaderboard && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                    <div className="bg-primary/90 backdrop-blur-sm border-2 border-accent/60 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg"></div>
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="p-4 border-b border-accent/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-accent" />
                              <h2 className="text-accent font-bold text-lg tracking-wider">🏆 CLASSEMENT COMPLET</h2>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-accent/20"
                              onClick={() => setShowLeaderboard(false)}
                            >
                              <X className="w-5 h-5 text-accent" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                          <div className="space-y-2">
                            {leaderboard.map((user, index) => (
                              <div 
                             key={user.pseudo + user.rank}
                                className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-accent/40"
                              >
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground font-bold text-sm">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <p className="font-bold text-primary-foreground text-sm">{user.pseudo}</p>
                                  <p className="text-xs text-accent">{user.points_himpact} points</p>
                                </div>
                                {index < 3 && (
                                  <span className="text-lg">
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay Détails du signalement */}
                {showReportDetails && selectedReport && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                    <div className="bg-primary/90 backdrop-blur-sm border-2 border-accent/60 rounded-lg shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg"></div>
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="p-4 border-b border-accent/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getTypeIcon(selectedReport.type)}</span>
                              <h2 className="text-accent font-bold text-lg tracking-wider">DÉTAILS SIGNALEMENT</h2>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-accent/20"
                              onClick={() => setShowReportDetails(false)}
                            >
                              <X className="w-5 h-5 text-accent" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
                          {/* Photo si disponible */}
                          {selectedReport.photo_url ? (
                            <div className="w-full">
                              <img 
                                src={selectedReport.photo_url} 
                                alt="Signalement" 
                                className="w-full h-48 object-cover rounded-lg border border-accent/30"
                                onLoad={() => console.log('Image loaded successfully:', selectedReport.photo_url)}
                                onError={(e) => console.log('Image failed to load:', selectedReport.photo_url, e)}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-48 bg-accent/10 rounded-lg border border-accent/30 flex items-center justify-center">
                              <p className="text-accent text-sm">Aucune photo disponible</p>
                            </div>
                          )}
                          
                          {/* Informations principales */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <User className="w-4 h-4 text-accent" />
                              <span className="text-primary-foreground font-bold">{selectedReport.user}</span>
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedReport.status)}`}></div>
                              <span className={`text-xs px-2 py-1 rounded ${
                                selectedReport.status === 'validated' ? 'bg-green-500/20 text-green-300' :
                                selectedReport.status === 'rejected' ? 'bg-red-500/20 text-red-300' :
                                'bg-yellow-500/20 text-yellow-300'
                              }`}>
                                {selectedReport.status === 'validated' ? 'Validé' : 
                                 selectedReport.status === 'rejected' ? 'Rejeté' : 'En attente'}
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-accent mt-0.5" />
                                <div>
                                  <p className="text-primary-foreground font-medium">{selectedReport.location}</p>
                                  <p className="text-xs text-accent">
                                    {selectedReport.coordinates.lat.toFixed(6)}, {selectedReport.coordinates.lng.toFixed(6)}
                                  </p>
                                </div>
                              </div>
                              
                              {selectedReport.description && (
                                <div className="bg-accent/10 p-3 rounded-lg border border-accent/30">
                                  <p className="text-primary-foreground text-sm">{selectedReport.description}</p>
                                </div>
                              )}
                              
                              <div className="flex items-center gap-2 text-xs text-accent">
                                <span>📅</span>
                                <span>{new Date(selectedReport.date).toLocaleDateString('fr-FR', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay Signalements complet */}
                {showReports && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
                    <div className="bg-primary/90 backdrop-blur-sm border-2 border-accent/60 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg"></div>
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="p-4 border-b border-accent/30">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Filter className="w-5 h-5 text-accent" />
                              <h2 className="text-accent font-bold text-lg tracking-wider">📡 TOUS LES SIGNALEMENTS</h2>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-accent/20"
                              onClick={() => setShowReports(false)}
                            >
                              <X className="w-5 h-5 text-accent" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-4 overflow-y-auto max-h-[60vh]">
                          <div className="space-y-3">
                            {filteredReports.map((report) => (
                              <div 
                                key={report.id}
                                className={`p-4 rounded-lg cursor-pointer transition-all bg-accent/20 border border-accent/40 hover:bg-accent/30 ${
                                  selectedReport?.id === report.id ? 'ring-2 ring-accent' : ''
                                }`}
                                 onClick={() => {
                                   setSelectedReport(report);
                                   setShowReports(false);
                                   setShowReportDetails(true);
                                 }}
                              >
                                <div className="flex items-start gap-3">
                                  <span className="text-xl">{getTypeIcon(report.type)}</span>
                                   <div className="flex-1">
                                     <div className="flex items-center gap-2 mb-2">
                                       <User className="w-3 h-3 text-accent" />
                                       <p className="font-bold text-primary-foreground text-sm">{report.user}</p>
                                       <div className={`w-3 h-3 rounded-full ${getStatusColor(report.status)}`}></div>
                                     </div>
                                     <p className="text-xs text-accent mb-1">📍 {report.location.split('(')[0].trim()}</p>
                                    <p className="text-xs text-primary-foreground/80">{report.description}</p>
                                    <p className="text-xs text-accent mt-2">{new Date(report.date).toLocaleString('fr-FR')}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Map;
