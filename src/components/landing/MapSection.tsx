
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Camera, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const MapSection = () => {
  // Données simulées des signalements récents
  const recentReports = [
    {
      id: 1,
      location: "Cocody, Angré",
      type: "Dépôt sauvage",
      time: "Il y a 2h",
      status: "En cours",
      severity: "high"
    },
    {
      id: 2,
      location: "Yopougon, Sicogi",
      type: "Caniveau bouché",
      time: "Il y a 4h",
      status: "Validé",
      severity: "medium"
    },
    {
      id: 3,
      location: "Abobo, PK18",
      type: "Plastiques éparpillés",
      time: "Il y a 6h",
      status: "Résolu",
      severity: "low"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'En cours': return 'bg-yellow-100 text-yellow-800';
      case 'Validé': return 'bg-blue-100 text-blue-800';
      case 'Résolu': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

                  {/* Simulated map pins */}
                  <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 right-1/3 w-4 h-4 bg-orange-500 rounded-full animate-ping"></div>
                  <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <div>
            <Card className="shadow-xl">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2 text-emerald-600" />
                  Signalements récents
                </h3>
                
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-gray-900">{report.location}</div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                          {report.type}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{report.time}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Camera className="w-4 h-4 mr-2" />
                    Faire un signalement
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-xl mt-6">
              <CardContent className="p-6">
                <h4 className="font-bold text-gray-900 mb-4">Statistiques du jour</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nouveaux signalements</span>
                    <span className="font-bold text-emerald-600">24</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Zones nettoyées</span>
                    <span className="font-bold text-green-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Citoyens actifs</span>
                    <span className="font-bold text-blue-600">156</span>
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
