import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Target, TrendingUp, AlertTriangle, Leaf } from "lucide-react";
import { TELEGRAM_BOT_URL } from "@/config/links";
const ImpactOverview = () => {
  return (
    <div className="py-20 bg-gradient-to-br from-slate-900 via-gray-800 to-green-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section inspiré du design */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-lime-400/20 text-lime-300 px-6 py-3 rounded-full text-sm font-bold mb-8 border border-lime-400/30">
            <Leaf className="w-5 h-5 mr-2" />
            NOTRE SOLUTION
          </div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
            La Ligne <span className="text-lime-400">Verte</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            La Ligne Verte est une initiative citoyenne basée sur la blockchain qui permettra aux habitants du Grand Abidjan de signaler facilement les zones insalubres via photos géolocalisées, lesquelles alimentent une cartographie ouverte servant à coordonner les actions environnementales.
          </p>
        </div>

        {/* Impact metrics avec style moderne */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <Card className="bg-card/10 backdrop-blur-sm border border-border text-card-foreground shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-card/15">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2 text-lime-400">400k</div>
              <div className="text-gray-300 text-sm font-medium">Tonnes de déchets/an</div>
            </CardContent>
          </Card>

          <Card className="bg-card/10 backdrop-blur-sm border border-border text-card-foreground shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-card/15">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold mb-2 text-orange-400">&lt; 5%</div>
              <div className="text-gray-300 text-sm font-medium">Taux recyclage</div>
            </CardContent>
          </Card>

          <Card className="bg-card/10 backdrop-blur-sm border border-border text-card-foreground shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-card/15">
            <CardContent className="p-6 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-2 text-lime-400" />
              <div className="text-gray-300 text-sm font-medium">Signalements actifs</div>
            </CardContent>
          </Card>

          <Card className="bg-card/10 backdrop-blur-sm border border-border text-card-foreground shadow-2xl transform hover:scale-105 transition-all duration-300 hover:bg-card/15">
            <CardContent className="p-6 text-center">
              <Users className="w-10 h-10 mx-auto mb-2 text-lime-400" />
              <div className="text-gray-300 text-sm font-medium">Citoyens mobilisés</div>
            </CardContent>
          </Card>
        </div>

        {/* Section call-to-action moderne */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            {/* Collage inspiré du design */}
            <div className="relative grid grid-cols-2 gap-4 h-96">
              <div className="bg-lime-400 rounded-2xl"></div>
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&h=200" 
                  alt="Nettoyage environnemental"
                  className="w-full h-44 object-cover rounded-2xl shadow-xl"
                />
                <div className="bg-green-600 rounded-2xl h-44"></div>
              </div>
              <div className="bg-green-500 rounded-2xl"></div>
              <img 
                src="https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?auto=format&fit=crop&w=300&h=200" 
                alt="Action citoyenne"
                className="w-full h-44 object-cover rounded-2xl shadow-xl"
              />
            </div>
            
            {/* Badge 2025 */}
            <div className="absolute -top-4 -right-4 bg-card text-card-foreground px-6 py-4 rounded-2xl shadow-2xl">
              <div className="text-4xl font-bold">20</div>
              <div className="text-4xl font-bold">25</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Rend ton quartier <span className="text-lime-400">zo</span><br />
              et prend tes points
            </h3>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg mb-1">1. Prends une photo</div>
                  <div className="text-gray-300">Zone insalubre, dépôt sauvage, pollution...</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg mb-1">2. Localisation automatique</div>
                  <div className="text-gray-300">GPS intégré pour un signalement précis</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-lime-400 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <div className="font-bold text-white text-lg mb-1">3. Gagne des points</div>
                  <div className="text-gray-300">Récompenses pour ton engagement citoyen</div>
                </div>
              </div>
            </div>

            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="block">
              <Button size="lg" className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 text-lg py-6 rounded-xl shadow-2xl font-bold border-2 border-lime-300 hover:border-lime-400 transition-all">
                <Target className="w-6 h-6 mr-3" />
                Commencer maintenant
              </Button>
            </a>
            
            <div className="mt-6 text-center">
              <div className="text-gray-400 text-sm mb-2">Contact</div>
              <div className="text-lime-400 font-medium">greenpillciv@gmail.com</div>
              <div className="text-lime-400 font-medium">www.greenpill.network</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactOverview;