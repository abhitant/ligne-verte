import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Target, TrendingUp, AlertTriangle, Leaf } from "lucide-react";

const ImpactOverview = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec urgence et espoir */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4 mr-2" />
            ABIDJAN A BESOIN DE TOI
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ensemble, créons le changement
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chaque signalement compte. Rejoins des milliers d'Ivoiriens qui transforment leur quartier.
          </p>
        </div>

        {/* Statistiques impactantes simplifiées */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl transform hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">400k</div>
              <div className="text-red-100 text-sm">Tonnes de déchets/an</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl transform hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold mb-2">&lt; 5%</div>
              <div className="text-orange-100 text-sm">Taux recyclage</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl transform hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <div className="text-green-100 text-sm">Signalements actifs</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl transform hover:scale-105 transition-transform">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2" />
              <div className="text-blue-100 text-sm">Citoyens mobilisés</div>
            </CardContent>
          </Card>
        </div>

        {/* Section inspiration avec image et call-to-action */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&h=400" 
              alt="Abidjan propre"
              className="w-full h-80 object-cover rounded-2xl shadow-2xl"
            />
          </div>
          
          <div>
            <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4 mr-2" />
              TON IMPACT
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              3 minutes pour changer ton quartier
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">1. Prends une photo</div>
                  <div className="text-gray-600 text-sm">Zone insalubre, dépôt sauvage...</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">2. Localise le problème</div>
                  <div className="text-gray-600 text-sm">GPS automatique</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">3. Vois le changement</div>
                  <div className="text-gray-600 text-sm">Suivi en temps réel</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-6 rounded-xl shadow-xl">
                <Target className="w-5 h-5 mr-2" />
                Faire mon premier signalement
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-gray-500">Déjà </span>
                <span className="font-bold text-green-600">2,847</span>
                <span className="text-sm text-gray-500"> Ivoiriens nous ont rejoint cette semaine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactOverview;