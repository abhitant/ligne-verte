
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Gift, Users, Leaf, Smartphone, ArrowRight, CheckCircle, Play, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [stats] = useState({
    zonesSignalees: 1250,
    gardiens: 500,
    quartiersZo: 85
  });

  const steps = [
    {
      icon: MessageCircle,
      title: "Je signale",
      description: "Via notre bot Telegram, je signale une zone insalubre près de chez moi",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: Gift,
      title: "Je gagne des points",
      description: "Chaque signalement validé me donne des points Himpact",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: Smartphone,
      title: "J'échange mes points",
      description: "Sur notre marketplace : crédit téléphonique, bons d'achat, produits écolo",
      color: "bg-green-100 text-green-600"
    }
  ];

  const benefits = [
    "Améliorer votre quartier",
    "Gagner des récompenses",
    "Rejoindre une communauté engagée",
    "Contribuer à un environnement plus sain"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section - Plus frais et élégant */}
      <div className="relative overflow-hidden h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(16, 185, 129, 0.7)), url('https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000&q=80')`
          }}
        ></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-5xl mx-auto px-6">
            <div className="mb-6">
              <Badge className="bg-white/20 text-white border-white/30 mb-8 text-sm px-4 py-2">
                🌿 La Ligne Verte Initiative
              </Badge>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
              Rend ton quartier <span className="text-green-300 drop-shadow-lg">Zo</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-green-100">
              et prend tes points
            </h2>
            <p className="text-lg md:text-xl mb-12 text-white/90 max-w-3xl mx-auto leading-relaxed">
              Ensemble pour rendre Abidjan plus propre. Chaque signalement compte, chaque action est récompensée.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 text-base px-8 py-4 h-auto font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <MapPin className="w-5 h-5 mr-2" />
                Faire un Signalement
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 text-base px-8 py-4 h-auto font-semibold transition-all duration-300">
                <TrendingUp className="w-5 h-5 mr-2" />
                Voir le Classement
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ArrowRight className="w-6 h-6 rotate-90 opacity-70" />
        </div>
      </div>

      {/* Stats Section - Plus élégant */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-green-100 text-green-800 mb-6 text-sm px-4 py-2">
              🎯 Notre Mission
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              <span className="text-green-600">La Ligne Verte</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed mb-4">
              La Ligne Verte transforme l'engagement citoyen en jeu où chaque habitant peut contribuer à rendre son quartier "Zo" (propre) via notre bot Telegram.
            </p>
            <p className="text-base text-gray-500 max-w-4xl mx-auto leading-relaxed">
              Chaque signalement de zone polluée et participation aux actions écologiques vous fait gagner des points. Plus tu rends ton quartier Zo, plus tu grimpes dans le classement !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-3">{stats.zonesSignalees.toLocaleString()}+</div>
              <div className="text-base text-gray-600 font-medium">Zones Polluées Signalées</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">{stats.gardiens.toLocaleString()}+</div>
              <div className="text-base text-gray-600 font-medium">Gardiens Ligne Verte</div>
            </div>
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100 hover:shadow-lg transition-all duration-300">
              <div className="text-4xl md:text-5xl font-bold text-orange-600 mb-3">{stats.quartiersZo}%</div>
              <div className="text-base text-gray-600 font-medium">Quartiers Devenus Zo</div>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 h-auto text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              <Users className="w-5 h-5 mr-2" />
              Rejoindre la Communauté
            </Button>
          </div>
        </div>
      </div>

      {/* Video Section - Plus moderne */}
      <div className="bg-gradient-to-br from-gray-50 to-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-800 mb-6 text-sm px-4 py-2">
                🎥 Comment Ça Marche
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Découvrez La Ligne Verte en action
              </h2>
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Regardez comment nos gardiens transforment Abidjan, quartier par quartier. 
                Une plateforme citoyenne qui récompense l'engagement environnemental.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  "Signalement en temps réel via Telegram",
                  "Système de points et récompenses",
                  "Carte interactive des signalements",
                  "Classement communautaire"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-base text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-base px-6 py-3 h-auto font-semibold">
                <Link to="/rejoindre" className="flex items-center gap-2">
                  Commencer maintenant
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl h-80 flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80')`
                  }}
                ></div>
                <div className="absolute inset-0 bg-green-900/40"></div>
                <Button 
                  size="lg" 
                  className="relative z-10 bg-white/90 hover:bg-white text-green-600 rounded-full w-16 h-16 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                >
                  <Play className="w-6 h-6" />
                </Button>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                  <span className="text-sm font-medium">Comment Ça Marche</span>
                  <br />
                  <span className="text-xs opacity-80">2:45 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section - Plus élégant */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-100 text-blue-800 mb-6 text-sm px-4 py-2">
              🗺️ Suivi en Temps Réel
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Carte Interactive des Signalements
            </h2>
            <p className="text-base text-gray-600 max-w-3xl mx-auto">
              Visualisez en temps réel tous les signalements effectués par la communauté à travers Abidjan
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-96 relative overflow-hidden shadow-xl border-0">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1200&q=80')`
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/80 to-blue-500/60"></div>
                <CardContent className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Carte Interactive d'Abidjan</h3>
                    <p className="text-white/80 mb-4 text-sm">Intégration Google Maps/OpenStreetMap</p>
                    <Button asChild className="bg-white text-green-600 hover:bg-green-50">
                      <Link to="/map" className="text-sm font-semibold">Voir la carte complète</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">Statistiques en Direct</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Signalements Actifs</span>
                    <span className="text-xl font-bold text-red-600">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Résolus Cette Semaine</span>
                    <span className="text-xl font-bold text-green-600">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Zones Prioritaires</span>
                    <span className="text-xl font-bold text-orange-600">8</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-700">Types de Signalements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Déchets sauvages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Problèmes d'égouts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">Pollution de l'air</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Plus moderne et élégant */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            "Rend ton quartier Zo, Prend tes points !"
          </h2>
          <p className="text-lg text-green-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Rejoignez des milliers de gardiens qui transforment Abidjan. 
            Chaque action compte, chaque point vous rapproche des récompenses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 text-base px-8 py-4 h-auto font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <a href="https://t.me/LigneVerteBot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Démarrer avec le bot
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-600 text-base px-8 py-4 h-auto font-semibold transition-all duration-300">
              <Link to="/marketplace" className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Voir les récompenses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
