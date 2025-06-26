
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Gift, Users, Leaf, Smartphone, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [stats] = useState({
    signalements: 1247,
    citoyens: 3892,
    zones: 156
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
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-800"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Leaf className="h-12 w-12 text-green-200" />
              <h1 className="text-5xl font-bold">La Ligne Verte</h1>
            </div>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              🇨🇮 Le projet citoyen qui transforme vos signalements en actions concrètes pour l'environnement en Côte d'Ivoire
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-green-800 hover:bg-green-50">
                <Link to="/rejoindre" className="flex items-center gap-2">
                  Rejoindre le mouvement
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
                <Link to="/map" className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Voir la carte
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.signalements.toLocaleString()}</div>
              <div className="text-gray-600">Signalements traités</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.citoyens.toLocaleString()}</div>
              <div className="text-gray-600">Citoyens engagés</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.zones}</div>
              <div className="text-gray-600">Zones nettoyées</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Comment ça marche ?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Trois étapes simples pour transformer votre quartier et gagner des récompenses
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  {index < steps.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-green-500 mx-auto mt-6 hidden md:block" />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-6">Pourquoi rejoindre La Ligne Verte ?</h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link to="/rejoindre" className="flex items-center gap-2">
                    Commencer maintenant
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-blue-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ensemble, agissons !</h3>
              <p className="text-gray-600 leading-relaxed">
                Chaque signalement compte. Chaque action fait la différence. 
                Rejoignez des milliers de citoyens qui transforment la Côte d'Ivoire.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à faire la différence ?</h2>
          <p className="text-xl text-green-100 mb-8">
            Commencez dès maintenant avec notre bot Telegram
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
              <a href="https://t.me/LigneVerteBot" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Démarrer avec le bot
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
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
