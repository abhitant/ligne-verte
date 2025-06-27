
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Trophy, Users, Zap, Target, Star, Medal, Smartphone, CheckCircle, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [stats] = useState({
    zonesSignalees: 1250,
    citoyensActifs: 500,
    quartiersPropres: 85,
    pointsDistribues: 125000
  });

  const missions = [
    {
      icon: Camera,
      title: "Signaler une zone",
      description: "Prends une photo d'une zone insalubre",
      points: "+50 points",
      difficulty: "Facile",
      color: "bg-green-500"
    },
    {
      icon: CheckCircle,
      title: "Vérifier un signalement",
      description: "Confirme l'état d'une zone signalée",
      points: "+30 points", 
      difficulty: "Facile",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Organiser un nettoyage",
      description: "Mobilise ton quartier pour une action",
      points: "+200 points",
      difficulty: "Héroïque",
      color: "bg-purple-500"
    }
  ];

  const achievements = [
    { name: "Éclaireur", description: "Premier signalement", icon: "🎯" },
    { name: "Gardien", description: "10 signalements validés", icon: "🛡️" },
    { name: "Héros Local", description: "Organise 5 actions", icon: "🦸‍♂️" },
    { name: "Champion", description: "Top 10 de ta commune", icon: "🏆" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header Navigation */}
      <nav className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">LV</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">La Ligne Verte</h1>
                <p className="text-xs text-green-600">Abidjan Plus Propre</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/map" className="text-gray-700 hover:text-green-600 font-medium">Carte</Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-green-600 font-medium">Récompenses</Link>
              <Link to="/user-profile" className="text-gray-700 hover:text-green-600 font-medium">Mon Profil</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4 mr-2" />
            Plateforme Citoyenne d'Abidjan
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Rends ton quartier
            <br />
            <span className="text-green-500">ZO</span> !
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Deviens un héros local en signalant, vérifiant et nettoyant les zones insalubres d'Abidjan. 
            Gagne des points Himpact et débloque des récompenses !
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl">
              <Camera className="w-5 h-5 mr-2" />
              Commencer une Mission
            </Button>
            <Link to="/map">
              <Button variant="outline" size="lg" className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 text-lg rounded-xl">
                <MapPin className="w-5 h-5 mr-2" />
                Voir la Carte
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Card className="bg-white shadow-lg border-l-4 border-l-green-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.zonesSignalees.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Zones Signalées</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-l-4 border-l-blue-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stats.citoyensActifs}</div>
              <div className="text-sm text-gray-600">Citoyens Actifs</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-l-4 border-l-purple-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.quartiersPropres}</div>
              <div className="text-sm text-gray-600">Quartiers Améliorés</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg border-l-4 border-l-yellow-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pointsDistribues.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Points Himpact</div>
            </CardContent>
          </Card>
        </div>

        {/* Missions Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Missions Disponibles</h2>
            <p className="text-lg text-gray-600">Choisis ta mission et commence à gagner des points Himpact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missions.map((mission, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0 overflow-hidden">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${mission.color} rounded-xl flex items-center justify-center mb-4`}>
                    <mission.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{mission.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {mission.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{mission.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-green-600 font-bold">{mission.points}</span>
                    <Button size="sm" className="bg-gray-900 hover:bg-gray-800 text-white">
                      Commencer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievement System */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Système de Badges</h2>
            <p className="text-lg text-gray-600">Débloque des badges et montre ton impact</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-white shadow-lg text-center">
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h4 className="font-bold text-gray-900 mb-1">{achievement.name}</h4>
                  <p className="text-xs text-gray-600">{achievement.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-gray-600">3 étapes simples pour devenir un héros local</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">1. Signale</h3>
              <p className="text-gray-600">Prends une photo d'une zone insalubre et géolocalise-la</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">2. Agis</h3>
              <p className="text-gray-600">Participe aux missions de nettoyage dans ton quartier</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">3. Gagne</h3>
              <p className="text-gray-600">Collecte des points Himpact et débloque des récompenses</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white text-center">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Prêt à devenir un héros local ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoins la communauté des citoyens qui transforment Abidjan
            </p>
            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl">
              <Smartphone className="w-5 h-5 mr-2" />
              Démarrer maintenant
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;
