import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { useMemo } from "react";

const ReportsDashboard = () => {
  const { data: reports = [], isLoading } = useReports();

  const stats = useMemo(() => {
    if (!reports || reports.length === 0) {
      return {
        totalReports: 0,
        validatedReports: 0,
        pendingReports: 0,
        uniqueUsers: 0,
        recentReports: []
      };
    }

    const totalReports = reports.length;
    const validatedReports = reports.filter(r => r.status === 'validated').length;
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const uniqueUsers = new Set(reports.map(r => r.user)).size;
    const recentReports = reports.slice(0, 5);

    return {
      totalReports,
      validatedReports,
      pendingReports,
      uniqueUsers,
      recentReports
    };
  }, [reports]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'validated':
        return <Badge className="bg-surface text-green-800 hover:bg-surface">Validé</Badge>;
      case 'rejected':
        return <Badge className="bg-surface text-red-800 hover:bg-surface">Rejeté</Badge>;
      default:
        return <Badge className="bg-surface text-yellow-800 hover:bg-surface">En attente</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'waste':
        return '🗑️';
      case 'drain':
        return '🚰';
      default:
        return '📍';
    }
  };

  if (isLoading) {
    return (
      <div className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Chargement des données...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-surface text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4 mr-2" />
            IMPACT LIGNE VERTE
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Signalements Citoyens
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Découvrez l'impact concret de notre communauté dans l'amélioration de l'environnement urbain
          </p>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">{stats.totalReports}</div>
              <div className="text-green-100 text-base">Signalements Total</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">{stats.uniqueUsers}</div>
              <div className="text-purple-100 text-base">Citoyens Actifs</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Signalements récents */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Signalements Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentReports.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentReports.map((report, index) => (
                    <div key={report.id || index} className="border border-border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(report.type)}</span>
                          <span className="font-medium text-foreground">{report.user}</span>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-muted-foreground text-sm mb-2">{report.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </span>
                        <span>{new Date(report.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Aucun signalement pour le moment</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Soyez le premier à signaler un problème environnemental !
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Impact visuel */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Notre Impact Ensemble</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <img 
                    src="https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=400&h=200" 
                    alt="Environnement vert"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-surface rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {Math.round(stats.validatedReports * 0.8)}
                    </div>
                    <div className="text-sm text-green-700">Zones nettoyées</div>
                  </div>
                  
                  <div className="text-center p-4 bg-surface rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {Math.round(stats.totalReports * 2.3)}kg
                    </div>
                    <div className="text-sm text-blue-700">Déchets collectés</div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
                  <h4 className="font-bold text-foreground mb-2">
                    Rejoignez le mouvement ! 🌱
                  </h4>
                  <p className="text-foreground text-sm mb-4">
                    Chaque signalement contribue à rendre Abidjan plus propre et plus verte.
                  </p>
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                    Faire un Signalement
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone d'encouragement */}
        <div className="mt-12 text-center">
          <div className="bg-card rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&h=300" 
                  alt="Nature préservée"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Votre Action Compte
                </h3>
                <p className="text-muted-foreground mb-6">
                  Grâce à vous, nous surveillons et améliorons notre environnement urbain. 
                  Chaque photo, chaque localisation nous aide à identifier et résoudre les problèmes 
                  environnementaux de notre belle ville d'Abidjan.
                </p>
                <div className="flex gap-4">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-medium transition-colors">
                    Télécharger l'App
                  </button>
                  <button className="border border-green-600 text-green-600 hover:bg-surface px-6 py-3 rounded-full font-medium transition-colors">
                    En Savoir Plus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;