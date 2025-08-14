
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, Camera, CheckCircle, XCircle, Settings, Bot, Users, BarChart3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useReports } from "@/hooks/useReports";
import { useLeaderboard } from "@/hooks/useGamification";
import { toast } from "sonner";

const Dashboard = () => {
  const { data: reports, isLoading: reportsLoading } = useReports();
  const { data: leaderboard, isLoading: leaderboardLoading } = useLeaderboard(50);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  // Set page metadata for SEO
  useEffect(() => {
    document.title = 'Dashboard Admin - La Ligne Verte';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Tableau de bord administrateur pour La Ligne Verte - Gestion des signalements et données environnementales');
    }
  }, []);

  // Fetch suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data, error } = await supabase
          .from('suggestions')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        setSuggestions(data || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Calculate stats
  const stats = {
    totalReports: reports?.length || 0,
    pendingReports: reports?.filter(r => r.status === 'pending').length || 0,
    validatedReports: reports?.filter(r => r.status === 'validated').length || 0,
    totalUsers: leaderboard?.length || 0,
    pendingSuggestions: suggestions?.filter(s => s.status === 'pending').length || 0,
    totalPoints: leaderboard?.reduce((sum, user) => sum + (user.points_himpact || 0), 0) || 0,
  };

  const handleValidate = async (reportId: string) => {
    try {
      const { error } = await supabase
        .rpc('update_report_status', { 
          p_report_id: reportId, 
          p_status: 'validé' 
        });

      if (error) throw error;
      toast.success('Signalement validé avec succès');
    } catch (error) {
      console.error('Error validating report:', error);
      toast.error('Erreur lors de la validation');
    }
  };

  const handleReject = async (reportId: string) => {
    try {
      const { error } = await supabase
        .rpc('update_report_status', { 
          p_report_id: reportId, 
          p_status: 'rejeté' 
        });

      if (error) throw error;
      toast.success('Signalement rejeté');
    } catch (error) {
      console.error('Error rejecting report:', error);
      toast.error('Erreur lors du rejet');
    }
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
    <main className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">🌱 Dashboard Admin</h1>
          <p className="text-lg text-muted-foreground">Gestion des signalements et données de La Ligne Verte</p>
        </header>

        {/* Stats Cards */}
        <section className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8" aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Statistiques générales</h2>
          
          <Card className="bg-card shadow-lg border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Total Signalements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalReports}</div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingReports}</div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Validés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.validatedReports}</div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.pendingSuggestions}</div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-l-4 border-l-yellow-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Points Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.totalPoints.toLocaleString()}</div>
            </CardContent>
          </Card>
        </section>

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
        <section className="mb-8" aria-labelledby="suggestions-heading">
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle id="suggestions-heading" className="flex items-center gap-2">
                💡 Suggestions des Utilisateurs
              </CardTitle>
              <CardDescription>
                Gérez les suggestions, bugs et demandes d'amélioration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {suggestionsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chargement des suggestions...
                </div>
              ) : suggestions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucune suggestion pour le moment
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.slice(0, 5).map((suggestion) => (
                    <div key={suggestion.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">User {suggestion.telegram_id}</span>
                            <Badge className={
                              suggestion.suggestion_type === 'bug' ? 'bg-red-100 text-red-800' :
                              suggestion.suggestion_type === 'feature' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {suggestion.suggestion_type === 'bug' ? '🐛 Bug' :
                               suggestion.suggestion_type === 'feature' ? '🔧 Amélioration' :
                               '💡 Suggestion'}
                            </Badge>
                            <Badge className={
                              suggestion.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              suggestion.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }>
                              {suggestion.status === 'pending' ? 'En attente' :
                               suggestion.status === 'resolved' ? 'Traité' : suggestion.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(suggestion.created_at).toLocaleDateString('fr-FR')}
                          </div>
                          <p className="text-foreground">{suggestion.content}</p>
                        </div>
                        {suggestion.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button className="bg-green-600 hover:bg-green-700" size="sm">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Marquer comme traité
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Reports List */}
        <section aria-labelledby="reports-heading">
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle id="reports-heading" className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Signalements Récents
              </CardTitle>
              <CardDescription>
                Gérez les signalements soumis par les citoyens
              </CardDescription>
            </CardHeader>
            <CardContent>
              {reportsLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Chargement des signalements...
                </div>
              ) : !reports || reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Aucun signalement pour le moment
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.slice(0, 10).map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={report.photo_url || '/placeholder.svg'} 
                            alt="Signalement" 
                            className="w-20 h-20 object-cover rounded-lg bg-muted"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <span className="font-medium">{report.user}</span>
                                {getStatusBadge(report.status)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                <MapPin className="w-4 h-4" />
                                {report.location}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(report.date).toLocaleDateString('fr-FR')}
                              </div>
                              <p className="text-foreground">{report.description || 'Aucune description'}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Camera className="w-4 h-4 text-primary" />
                                <span className="text-sm text-primary font-medium">
                                  Points Himpact
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
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
