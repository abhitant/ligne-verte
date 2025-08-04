
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Camera, CheckCircle, XCircle, Settings, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Report {
  id: string;
  user: string;
  location: string;
  coordinates: { lat: number; lng: number };
  description: string;
  photo: string;
  date: string;
  status: 'pending' | 'validated' | 'rejected';
  points: number;
}

const Dashboard = () => {
  const [reports] = useState<Report[]>([
    {
      id: '1',
      user: 'Kouame Jean',
      location: 'Cocody, Abidjan',
      coordinates: { lat: 5.3478, lng: -4.0267 },
      description: 'Poubelles sauvages près du marché',
      photo: '/placeholder.svg',
      date: '2024-01-15',
      status: 'pending',
      points: 10
    },
    {
      id: '2',
      user: 'Aminata Traoré',
      location: 'Yopougon, Abidjan',
      coordinates: { lat: 5.3364, lng: -4.0854 },
      description: 'Caniveau bouché devant école',
      photo: '/placeholder.svg',
      date: '2024-01-14',
      status: 'validated',
      points: 15
    },
    {
      id: '3',
      user: 'Ibrahim Diallo',
      location: 'Adjamé, Abidjan',
      coordinates: { lat: 5.3600, lng: -4.0100 },
      description: 'Déchets plastiques sur le trottoir',
      photo: '/placeholder.svg',
      date: '2024-01-13',
      status: 'pending',
      points: 8
    }
  ]);

  const handleValidate = (id: string) => {
    console.log('Validating report:', id);
    // Ici on appellerait l'API pour valider le signalement
  };

  const handleReject = (id: string) => {
    console.log('Rejecting report:', id);
    // Ici on appellerait l'API pour rejeter le signalement
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejeté</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>;
    }
  };

  const handleSetupDebora = async () => {
    try {
      toast.loading("Configuration du profil de Débora en cours...");
      
      const { data, error } = await supabase.functions.invoke('setup-debora-profile');
      
      if (error) {
        throw error;
      }
      
      toast.dismiss();
      toast.success("Profil de Débora configuré avec succès !");
      console.log('Setup result:', data);
    } catch (error) {
      toast.dismiss();
      toast.error("Erreur lors de la configuration du profil");
      console.error('Setup error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">🌱 La Ligne Verte</h1>
          <p className="text-lg text-gray-600">Dashboard Administrateur - Gestion des signalements</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-card shadow-lg border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Signalements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">247</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-lg border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">12</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-lg border-l-4 border-l-secondary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Validés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">198</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-lg border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">8</div>
            </CardContent>
          </Card>
          <Card className="bg-card shadow-lg border-l-4 border-l-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Points Distribués</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">2,847</div>
            </CardContent>
          </Card>
        </div>

        {/* Bot Configuration */}
        <Card className="bg-card shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Configuration du Bot Telegram
            </CardTitle>
            <CardDescription>
              Configurez le profil de Débora, votre standardiste Telegram
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Cliquez sur le bouton ci-dessous pour configurer le nom, la description et la photo de profil de Débora sur Telegram.
                </p>
                <p className="text-xs text-gray-500">
                  Note: Les changements peuvent prendre quelques minutes pour apparaître dans Telegram.
                </p>
              </div>
              <Button 
                onClick={handleSetupDebora}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurer Débora
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions Section */}
        <Card className="bg-card shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Suggestions des Utilisateurs
            </CardTitle>
            <CardDescription>
              Gérez les suggestions, bugs et demandes d'amélioration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">User 1234</span>
                      <Badge className="bg-orange-100 text-orange-800">🐛 Bug</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      2024-01-15
                    </div>
                    <p className="text-gray-700">Le bot ne répond pas quand j'envoie plusieurs photos d'affilée</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700" size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marquer comme traité
                    </Button>
                  </div>
                </div>
              </div>
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">User 5678</span>
                      <Badge className="bg-blue-100 text-blue-800">🔧 Amélioration</Badge>
                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      2024-01-14
                    </div>
                    <p className="text-gray-700">Ajouter une option pour signaler les problèmes d'éclairage public</p>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700" size="sm">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Marquer comme traité
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="bg-card shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Signalements Récents
            </CardTitle>
            <CardDescription>
              Gérez les signalements soumis par les citoyens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={report.photo} 
                        alt="Signalement" 
                        className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{report.user}</span>
                            {getStatusBadge(report.status)}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <MapPin className="w-4 h-4" />
                            {report.location}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(report.date).toLocaleDateString('fr-FR')}
                          </div>
                          <p className="text-gray-700">{report.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Camera className="w-4 h-4 text-blue-500" />
                            <span className="text-sm text-blue-600 font-medium">
                              {report.points} points Himpact
                            </span>
                          </div>
                        </div>
                        {report.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleValidate(report.id)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Valider
                            </Button>
                            <Button 
                              onClick={() => handleReject(report.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Rejeter
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
