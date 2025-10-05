import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Loader2, Trophy, Award, Users, X, ChevronDown, ChevronUp, User, RefreshCw } from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";
import Leaderboard from "@/components/gamification/Leaderboard";
import { useLeaderboard } from "@/hooks/useGamification";
import { useReports } from "@/hooks/useReports";
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
  const [showFullscreenImage, setShowFullscreenImage] = useState(false);
  const [locationName, setLocationName] = useState<string>('');
  
  const { data: leaderboard = [] } = useLeaderboard(10);
  const { data: reports = [], isLoading, error } = useReports();

  // Fonction pour obtenir le nom de la localité via géocodage inverse
  const fetchLocationName = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
      );
      const data = await response.json();
      
      if (data.address) {
        const { suburb, neighbourhood, quarter, city_district, city, town, village } = data.address;
        const locality = suburb || neighbourhood || quarter || city_district || town || village || city || 'Abidjan';
        return locality;
      }
      return 'Abidjan';
    } catch (error) {
      console.error('Error fetching location name:', error);
      return 'Abidjan';
    }
  };

  // Charger le nom de la localité quand un signalement est sélectionné
  useEffect(() => {
    if (selectedReport && showReportDetails) {
      fetchLocationName(selectedReport.coordinates.lat, selectedReport.coordinates.lng)
        .then(name => setLocationName(name));
    }
  }, [selectedReport, showReportDetails]);


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
                <div className="text-xs sm:text-sm bg-accent/20 text-accent-foreground px-3 py-1 border border-accent-foreground/30 font-bold tracking-wide rounded">
                  CARTE INTERACTIVE
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative overflow-hidden">
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
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 space-y-2 sm:space-y-3 w-56 sm:w-64 lg:w-72 pointer-events-auto z-[1000]">
                
                {/* Statistiques compactes HUD */}
                <div className="bg-primary/90 backdrop-blur-md border-2 border-accent/60 rounded-lg shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent rounded-lg"></div>
                  
                  {/* Header avec bouton toggle */}
                  <div className="relative z-10 p-2 sm:p-3 border-b border-accent/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                        <h3 className="text-accent font-bold text-xs sm:text-sm tracking-wider">STATS</h3>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-accent/20 flex-shrink-0"
                        onClick={() => setIsHUDOpen(!isHUDOpen)}
                      >
                        {isHUDOpen ? (
                          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Contenu pliable */}
                  {isHUDOpen && (
                    <div className="relative z-10 p-2 sm:p-3 space-y-2 sm:space-y-3">
                      
                      {/* Top 3 Compact */}
                      {leaderboard.length > 0 ? (
                        <div>
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent flex-shrink-0" />
                            <h3 className="text-accent font-bold text-xs sm:text-sm tracking-wider">TOP 3</h3>
                          </div>
                          <div className="space-y-1">
                            {leaderboard.slice(0, 3).map((user, index) => (
                               <div key={user.pseudo + user.rank} className="flex items-center gap-1.5 sm:gap-2 text-xs">
                                 <span className="text-xs sm:text-sm flex-shrink-0">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                                 <User className="w-3 h-3 text-accent flex-shrink-0" />
                                 <span className="text-primary-foreground font-medium flex-1 truncate min-w-0">{user.pseudo}</span>
                                 <span className="text-accent font-bold text-xs sm:text-sm flex-shrink-0">{user.points_himpact}</span>
                               </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-accent/60 text-xs">Aucun joueur</p>
                        </div>
                      )}

                      <div className="flex gap-1.5 sm:gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-accent/80 text-accent-foreground hover:bg-accent text-xs py-1 h-6 sm:h-7"
                          onClick={() => setShowLeaderboard(true)}
                        >
                          Classement
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 bg-accent/80 text-accent-foreground hover:bg-accent text-xs py-1 h-6 sm:h-7"
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
                            <div 
                              className="w-full cursor-pointer group relative"
                              onClick={() => setShowFullscreenImage(true)}
                            >
                              <img 
                                src={selectedReport.photo_url} 
                                alt="Signalement" 
                                className="w-full h-48 object-cover rounded-lg border border-accent/30 transition-transform group-hover:scale-[1.02]"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-all flex items-center justify-center">
                                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
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
                                  <p className="text-primary-foreground font-medium">
                                    {locationName || 'Chargement...'}
                                  </p>
                                  <p className="text-xs text-accent">
                                    {selectedReport.coordinates.lat.toFixed(6)}, {selectedReport.coordinates.lng.toFixed(6)}
                                  </p>
                                </div>
                              </div>
                              
                              {selectedReport.description && 
                               !selectedReport.description.includes('Signalement via Telegram') && 
                               selectedReport.description !== 'Signalement via bot Telegram' && (
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

                {/* Overlay Image plein écran */}
                {showFullscreenImage && selectedReport?.photo_url && (
                  <div 
                    className="absolute inset-0 bg-black/90 z-[3000] flex items-center justify-center p-4"
                    onClick={() => setShowFullscreenImage(false)}
                  >
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-4 right-4 h-10 w-10 p-0 hover:bg-white/20 bg-black/50 rounded-full z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullscreenImage(false);
                        }}
                      >
                        <X className="w-6 h-6 text-white" />
                      </Button>
                      <img 
                        src={selectedReport.photo_url} 
                        alt="Signalement en plein écran" 
                        className="max-w-full max-h-full object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                      />
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
                          {isLoading ? (
                            <div className="text-center py-12">
                              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-accent" />
                              <p className="text-primary-foreground/80">Chargement des signalements...</p>
                            </div>
                          ) : reports.length === 0 ? (
                            <div className="text-center py-12">
                              <p className="text-primary-foreground/80">Aucun signalement trouvé</p>
                            </div>
                          ) : (
                            <div className="grid gap-3">
                              {reports.filter(report => 
                                filter === 'all' || report.status === filter
                              ).map((report) => (
                                <div
                                  key={report.id}
                                  className={`p-3 rounded-lg border cursor-pointer transition-all hover:border-accent/60 ${
                                    selectedReport?.id === report.id 
                                      ? 'bg-accent/20 border-accent/60' 
                                      : 'bg-accent/10 border-accent/30'
                                  }`}
                                  onClick={() => {
                                    setSelectedReport(report);
                                    setShowReports(false);
                                    setShowReportDetails(true);
                                  }}
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <span className="text-lg">{getTypeIcon(report.type)}</span>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-primary-foreground text-sm">{report.user}</span>
                                        <div className={`w-2 h-2 rounded-full ${getStatusColor(report.status)}`}></div>
                                      </div>
                                      <p className="text-xs text-accent">{report.location}</p>
                                    </div>
                                    <span className="text-xs text-accent">
                                      {new Date(report.date).toLocaleDateString('fr-FR')}
                                    </span>
                                  </div>
                                  <p className="text-xs text-primary-foreground/80 truncate">{report.description}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Map;