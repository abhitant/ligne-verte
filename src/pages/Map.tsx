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
        {/* Carte plein écran pure - sans header */}
        <div className="h-full w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full bg-primary text-primary-foreground">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-accent" />
                <p className="text-primary-foreground font-bold">CHARGEMENT DE LA ZONE...</p>
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
        </div>
      </div>
    </div>
  );
};

export default Map;