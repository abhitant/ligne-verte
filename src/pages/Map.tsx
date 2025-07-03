
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Filter, Eye, Loader2, Trophy, Award, Users } from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";
import { useReports } from "@/hooks/useReports";
import UserProfile from "@/components/gamification/UserProfile";
import Leaderboard from "@/components/gamification/Leaderboard";
import { useLeaderboard, useUserStats } from "@/hooks/useGamification";
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
  const [activeTab, setActiveTab] = useState<'reports' | 'leaderboard'>('reports');
  
  const { data: reports = [], isLoading, error } = useReports();
  const { data: leaderboard = [] } = useLeaderboard(10);
  const sampleUserId = "5962973530"; // Use the actual user ID from console logs
  const { data: userStats } = useUserStats(sampleUserId);

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
              <h1 className="text-3xl font-bold text-green-800 mb-1">🗺️ Carte des Signalements</h1>
              <p className="text-gray-600">Découvre les zones signalées par la communauté</p>
            </div>
          </div>

          {/* Stats Rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-green-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-600">{reports.length}</div>
              <div className="text-xs text-green-700">Signalements</div>
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
              <div className="text-xs text-blue-700">Validés</div>
            </div>
            <div className="bg-red-100 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.status === 'rejected').length}
              </div>
              <div className="text-xs text-red-700">Rejetés</div>
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

          {/* Sidebar */}
          <div className="space-y-4">
            {/* User Profile - if user stats are available */}
            {userStats && (
              <UserProfile 
                userStats={{
                  pseudo: userStats.pseudo || "Utilisateur",
                  experience_points: userStats.experience_points || 0,
                  level_current: userStats.level_current || 1,
                  reports_count: userStats.reports_count || 0,
                  cleanups_count: userStats.cleanups_count || 0,
                  streak_days: userStats.streak_days || 0,
                  badges: Array.isArray(userStats.badges) ? userStats.badges as string[] : [],
                  rank: leaderboard.find(u => u.telegram_id === sampleUserId)?.rank
                }}
              />
            )}

            {/* Navigation Tabs */}
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-2">
                <div className="flex gap-2">
                  <Button
                    variant={activeTab === 'reports' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('reports')}
                    className="flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Signalements ({filteredReports.length})
                  </Button>
                  <Button
                    variant={activeTab === 'leaderboard' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveTab('leaderboard')}
                    className="flex items-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Classement
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="max-h-[450px] overflow-y-auto">
                {activeTab === 'reports' ? (
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                      </div>
                    ) : filteredReports.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
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
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Leaderboard 
                      users={leaderboard} 
                      currentUserId={sampleUserId}
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
