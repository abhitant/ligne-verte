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
      <div className="h-screen">
        {/* Card wrapper gaming style */}
        <Card className="bg-primary text-primary-foreground border-2 border-accent/50 shadow-2xl h-full w-full rounded-none">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center gap-2 text-primary-foreground text-lg">
                <MapPin className="w-5 h-5 text-accent animate-pulse" />
                <span className="text-accent font-bold tracking-wider">URGENCE ENVIRONNEMENTALE SIGNALÉ</span>
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
          <CardContent className="h-[calc(100%-80px)] p-0">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Map;