
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useReports } from "@/hooks/useReports";

const MapSection = () => {
  const { data: reports = [], isLoading } = useReports();

  // Prendre les 3 signalements les plus récents
  const recentReports = reports.slice(0, 3);

  const getSeverityColor = (type: string) => {
    switch (type) {
      case 'waste': return 'bg-red-100 text-red-800';
      case 'drain': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'validated': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'validated': return 'Validé';
      case 'rejected': return 'Rejeté';
      default: return 'Inconnu';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'waste': return 'Déchets';
      case 'drain': return 'Caniveau';
      default: return 'Autre';
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Carte interactive des signalements
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvre les zones signalées par la communauté et contribue à rendre ton quartier plus propre
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Preview */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-96 bg-gradient-to-br from-green-100 to-emerald-200">
                  {/* Placeholder for actual map */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                        Carte interactive
                      </h3>
                      <p className="text-emerald-600 mb-6">
                        Visualise tous les signalements en temps réel
                      </p>
                      <Link to="/map">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          <Navigation className="w-4 h-4 mr-2" />
                          Ouvrir la carte complète
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Points dynamiques basés sur les vraies données */}
                  {reports.slice(0, 5).map((report, index) => (
                    <div 
                      key={report.id}
                      className={`absolute w-4 h-4 rounded-full animate-ping ${
                        report.status === 'validated' ? 'bg-green-500' :
                        report.status === 'rejected' ? 'bg-red-500' : 'bg-orange-500'
                      }`}
                      style={{
                        top: `${20 + (index * 15)}%`,
                        left: `${25 + (index * 20)}%`
                      }}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Recent Reports */}
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-emerald-600" />
                  Signalements récents
                </h3>
                
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                      <p className="text-sm text-gray-500 mt-2">Chargement...</p>
                    </div>
                  ) : recentReports.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Aucun signalement pour le moment</p>
                      <p className="text-sm mt-2">Sois le premier à signaler !</p>
                    </div>
                  ) : (
                    recentReports.map((report) => (
                      <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="font-medium text-gray-900">{report.user}</div>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.type)}`}>
                            {getTypeText(report.type)}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">
                            {new Date(report.date).toLocaleDateString('fr-FR')}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                            {getStatusText(report.status)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-xl mt-6">
              <CardContent className="p-6">
                <h4 className="font-bold text-gray-900 mb-4">Statistiques</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total signalements</span>
                    <span className="font-bold text-emerald-600">{reports.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">En attente</span>
                    <span className="font-bold text-yellow-600">
                      {reports.filter(r => r.status === 'pending').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Validés</span>
                    <span className="font-bold text-green-600">
                      {reports.filter(r => r.status === 'validated').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
