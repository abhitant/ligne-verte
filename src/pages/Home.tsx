
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Gift, Users, Leaf, Smartphone, ArrowRight, CheckCircle, Play, TrendingUp, Calendar } from "lucide-react";
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
      color: "bg-emerald-50 text-emerald-600"
    },
    {
      icon: Gift,
      title: "Je gagne des points",
      description: "Chaque signalement validé me donne des points Himpact",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: Smartphone,
      title: "J'échange mes points",
      description: "Sur notre marketplace : crédit téléphonique, bons d'achat, produits écolo",
      color: "bg-orange-50 text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">La Ligne Verte</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-emerald-300 transition-colors">Accueil</Link>
            <Link to="/map" className="text-white hover:text-emerald-300 transition-colors">Carte</Link>
            <Link to="/marketplace" className="text-white hover:text-emerald-300 transition-colors">Marketplace</Link>
            <Link to="/join" className="text-white hover:text-emerald-300 transition-colors">À propos</Link>
            <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
              Commencer
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(16, 185, 129, 0.85), rgba(34, 197, 94, 0.75)), url('https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2000&q=80')`
          }}
        ></div>
        
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Votre Quartier,<br />
                <span className="text-emerald-200">Rendu Zo</span>
              </h1>
              <p className="text-xl md:text-2xl text-emerald-100 mb-4 font-light">
                Initiative citoyenne pour transformer Abidjan
              </p>
              <p className="text-lg text-white/90 mb-12 max-w-2xl leading-relaxed">
                et prendre vos points
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 h-auto text-lg font-semibold">
                  <Calendar className="w-5 h-5 mr-2" />
                  Faire un Signalement
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 h-auto text-lg font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Découvrir le Projet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <Badge className="bg-emerald-100 text-emerald-800 mb-6 px-4 py-2">
              🌿 Notre Mission
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Plateforme Citoyenne pour un <br />
              <span className="text-emerald-600">Abidjan Plus Propre</span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              La Ligne Verte transforme l'engagement citoyen en expérience ludique. 
              Chaque signalement de zone polluée vous rapporte des points échangeables 
              contre des récompenses concrètes.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.zonesSignalees.toLocaleString()}+</div>
              <div className="text-gray-600">Zones Signalées</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stats.gardiens.toLocaleString()}+</div>
              <div className="text-gray-600">Gardiens Actifs</div>
            </div>
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
              <div className="text-4xl font-bold text-orange-600 mb-2">{stats.quartiersZo}%</div>
              <div className="text-gray-600">Quartiers Améliorés</div>
            </div>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6`}>
                    <step.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-blue-100 text-blue-800 mb-6 px-4 py-2">
                🗺️ Suivi Temps Réel
              </Badge>
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Carte Interactive d'Abidjan
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Visualisez tous les signalements de la communauté en temps réel
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Signalements géolocalisés",
                  "Suivi des interventions",
                  "Zones prioritaires identifiées",
                  "Statistiques par quartier"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/map">
                  Voir la Carte Complète
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <Card className="h-96 overflow-hidden shadow-xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=800&q=80')`
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/80 to-blue-500/60"></div>
                <CardContent className="relative z-10 h-full flex items-center justify-center">
                  <div className="text-center text-white">
                    <MapPin className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Carte d'Abidjan</h3>
                    <p className="text-white/80 mb-4">23 signalements actifs</p>
                    <Button className="bg-white/20 hover:bg-white/30 border border-white/30">
                      Ouvrir la carte
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
            Prêt à Rendre Votre Quartier Zo ?
          </h2>
          <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
            Rejoignez des milliers de gardiens qui transforment Abidjan, un signalement à la fois.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 h-auto text-lg font-semibold">
              <a href="https://t.me/LigneVerteBot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Démarrer avec le Bot
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 h-auto text-lg font-semibold">
              <Link to="/marketplace" className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Voir les Récompenses
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
