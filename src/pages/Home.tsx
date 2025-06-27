
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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Inspiré de la capture avec le message "Rend ton quartier Zo" */}
      <div className="relative overflow-hidden h-screen">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000&q=80')`
          }}
        ></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              Rend ton quartier <span className="text-green-400">Zo</span>
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
              et prend tes points
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-3xl mx-auto">
              La Ligne Verte - Ensemble pour rendre Abidjan plus propre
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4 h-auto">
                <MapPin className="w-6 h-6 mr-2" />
                Faire un Signalement
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4 h-auto">
                <TrendingUp className="w-6 h-6 mr-2" />
                Voir le Classement
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <ArrowRight className="w-8 h-8 rotate-90" />
        </div>
      </div>

      {/* Stats Section - Inspiré de la section "Notre Mission" */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6">
              Notre Mission <span className="text-green-600">La Ligne Verte</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              La Ligne Verte transforme l'engagement citoyen en jeu où chaque habitant peut contribuer à rendre son quartier "Zo" (propre) via notre bot Telegram.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-6 leading-relaxed">
              Chaque signalement de zone polluée et participation aux actions écologiques vous fait gagner des points. Plus tu rends ton quartier Zo, plus tu grimpes dans le classement !
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">{stats.zonesSignalees.toLocaleString()}+</div>
              <div className="text-xl text-gray-600">Zones Polluées Signalées</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">{stats.gardiens.toLocaleString()}+</div>
              <div className="text-xl text-gray-600">Gardiens Ligne Verte</div>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">{stats.quartiersZo}%</div>
              <div className="text-xl text-gray-600">Quartiers Devenus Zo</div>
            </div>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 h-auto text-lg">
              <Users className="w-6 h-6 mr-2" />
              Rejoindre la Communauté
            </Button>
          </div>
        </div>
      </div>

      {/* Video Section - Inspiré de la section avec la vidéo */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-green-100 text-green-800 mb-6">🎥 Comment Ça Marche</Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Découvrez La Ligne Verte en action
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
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
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Link to="/rejoindre" className="flex items-center gap-2">
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gray-300 rounded-2xl h-80 flex items-center justify-center relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&w=800&q=80')`
                  }}
                ></div>
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <Button 
                  size="lg" 
                  className="relative z-10 bg-white hover:bg-gray-100 text-gray-900 rounded-full w-20 h-20"
                >
                  <Play className="w-8 h-8" />
                </Button>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded">
                  <span className="text-sm">Comment Ça Marche</span>
                  <br />
                  <span className="text-xs">2:45 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Section - Inspiré de la carte interactive */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Carte Interactive des Signalements
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visualisez en temps réel tous les signalements effectués par la communauté à travers Abidjan
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="h-96 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1200&q=80')`
                  }}
                ></div>
                <div className="absolute inset-0 bg-green-100 bg-opacity-90"></div>
                <CardContent className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-16 h-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Carte Interactive d'Abidjan</h3>
                    <p className="text-gray-600 mb-4">Intégration Google Maps/OpenStreetMap</p>
                    <Button asChild>
                      <Link to="/map">Voir la carte complète</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Statistiques en Direct</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Signalements Actifs</span>
                    <span className="text-2xl font-bold text-red-600">23</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Résolus Cette Semaine</span>
                    <span className="text-2xl font-bold text-green-600">15</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Zones Prioritaires</span>
                    <span className="text-2xl font-bold text-orange-600">8</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">Types de Signalements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>Déchets sauvages</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span>Problèmes d'égouts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Pollution de l'air</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Inspiré du message "Rend ton quartier Zo, Prend tes points !" */}
      <div className="bg-green-600 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            "Rend ton quartier Zo, Prend tes points !"
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers de gardiens qui transforment Abidjan. 
            Chaque action compte, chaque point vous rapproche des récompenses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 text-lg px-8 py-4 h-auto">
              <a href="https://t.me/LigneVerteBot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Démarrer avec le bot
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4 h-auto">
              <Link to="/marketplace" className="flex items-center gap-2">
                <Gift className="w-6 h-6" />
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
