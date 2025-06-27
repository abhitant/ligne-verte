
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Camera, Trophy, Users, Zap, Target, Star, Medal, Smartphone, CheckCircle, TrendingUp, AlertTriangle, Recycle, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [stats] = useState({
    zonesSignalees: 1250,
    citoyensActifs: 500,
    quartiersPropres: 85,
    pointsDistribues: 125000
  });

  const environmentalStats = [
    {
      icon: "🏗️",
      stat: "400 000 tonnes",
      description: "de plastique produites chaque année en Côte d'Ivoire",
      color: "text-red-600"
    },
    {
      icon: "🗑️", 
      stat: "50%",
      description: "sont jetées directement dans la rue",
      color: "text-orange-600"
    },
    {
      icon: "♻️",
      stat: "< 5%",
      description: "sont recyclées",
      color: "text-blue-600"
    },
    {
      icon: "📊",
      stat: "280 000 tonnes",
      description: "produites par Abidjan seule (seulement 3% recyclées)",
      color: "text-purple-600"
    }
  ];

  const impactStats = [
    {
      icon: "⚠️",
      title: "Caniveaux bouchés",
      description: "Inondations à répétition"
    },
    {
      icon: "🏥",
      title: "Prolifération des maladies", 
      description: "Impact sur la santé publique"
    },
    {
      icon: "🌍",
      title: "Pollution environnementale",
      description: "Sols, eau et air contaminés"
    },
    {
      icon: "🚨",
      title: "Urgence sanitaire",
      description: "Abidjan en crise écologique silencieuse"
    }
  ];

  const missions = [
    {
      icon: Camera,
      title: "Signaler une zone",
      description: "Prends une photo d'une zone insalubre",
      points: "+50 points",
      difficulty: "Facile",
      color: "bg-emerald-600"
    },
    {
      icon: CheckCircle,
      title: "Vérifier un signalement",
      description: "Confirme l'état d'une zone signalée",
      points: "+30 points", 
      difficulty: "Facile",
      color: "bg-teal-600"
    },
    {
      icon: Users,
      title: "Organiser un nettoyage",
      description: "Mobilise ton quartier pour une action",
      points: "+200 points",
      difficulty: "Héroïque",
      color: "bg-green-700"
    }
  ];

  const achievements = [
    { name: "Éclaireur", description: "Premier signalement", icon: "🎯" },
    { name: "Gardien", description: "10 signalements validés", icon: "🛡️" },
    { name: "Héros Local", description: "Organise 5 actions", icon: "🦸‍♂️" },
    { name: "Champion", description: "Top 10 de ta commune", icon: "🏆" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      {/* Header Navigation */}
      <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">LV</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">La Ligne Verte</h1>
                <p className="text-xs text-emerald-700 font-medium">Rend ton quartier zo et prend tes points</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/map" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Carte</Link>
              <Link to="/marketplace" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Récompenses</Link>
              <Link to="/user-profile" className="text-gray-700 hover:text-emerald-600 font-medium transition-colors">Mon Profil</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-pulse">
            <AlertTriangle className="w-4 h-4 mr-2" />
            PLUS QU'UNE ALERTE. C'EST UNE ALARME.
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Rend ton quartier
            <br />
            <span className="text-yellow-400">ZO</span> et prend tes points
          </h1>
          
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            <strong>280 000 tonnes</strong> de déchets produits par Abidjan chaque année. 
            Seuls <strong>3%</strong> trouvent une seconde vie. Le reste envahit nos rues, 
            bouche nos caniveaux, pollue nos lagunes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all">
              <Camera className="w-5 h-5 mr-2" />
              Agir Maintenant
            </Button>
            <Link to="/map">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg rounded-xl backdrop-blur-sm">
                <MapPin className="w-5 h-5 mr-2" />
                Voir la Carte
              </Button>
            </Link>
          </div>
        </div>

        {/* Environmental Crisis Stats */}
        <div className="mb-16 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">L'INSALUBRITÉ DU GRAND ABIDJAN EN QUELQUES CHIFFRES</h2>
            <p className="text-emerald-100 text-lg">Une urgence sanitaire et écologique silencieuse</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {environmentalStats.map((stat, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-xl border-0 hover:bg-white transition-all transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className={`text-2xl font-bold mb-2 ${stat.color}`}>{stat.stat}</div>
                  <div className="text-sm text-gray-600 leading-relaxed">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl p-6 border border-red-300/30">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Des conséquences visibles et invisibles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {impactStats.map((impact, index) => (
                <div key={index} className="text-center p-4">
                  <div className="text-3xl mb-2">{impact.icon}</div>
                  <div className="text-white font-bold mb-1">{impact.title}</div>
                  <div className="text-emerald-100 text-sm">{impact.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-l-4 border-l-emerald-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">{stats.zonesSignalees.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Zones Signalées</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-l-4 border-l-teal-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-teal-600 mb-2">{stats.citoyensActifs}</div>
              <div className="text-sm text-gray-600">Héros Actifs</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-l-4 border-l-green-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.quartiersPropres}</div>
              <div className="text-sm text-gray-600">Quartiers Transformés</div>
            </CardContent>
          </Card>
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-l-4 border-l-yellow-500">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">{stats.pointsDistribues.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Points Himpact</div>
            </CardContent>
          </Card>
        </div>

        {/* Solution Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 mb-16 shadow-2xl">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-4">CERTAINS PRENNENT NOS RUES POUR DES POUBELLES</h2>
            <p className="text-xl mb-6 opacity-90">Mais toi, tu peux devenir la solution.</p>
            <div className="flex justify-center items-center space-x-4">
              <HeartHandshake className="w-12 h-12" />
              <span className="text-2xl font-bold">Ensemble, changeons Abidjan</span>
            </div>
          </div>
        </div>

        {/* Missions Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Missions Héroïques</h2>
            <p className="text-lg text-emerald-100">Chaque action compte, chaque citoyen peut faire la différence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missions.map((mission, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all border-0 overflow-hidden transform hover:scale-105">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${mission.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <mission.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{mission.title}</h3>
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800">
                      {mission.difficulty}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{mission.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-600 font-bold">{mission.points}</span>
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
            <h2 className="text-3xl font-bold text-white mb-4">Système de Badges</h2>
            <p className="text-lg text-emerald-100">Débloque des badges et montre ton impact</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-white/90 backdrop-blur-sm shadow-xl text-center hover:bg-white transition-all">
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
        <div className="mb-16 bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Comment ça marche ?</h2>
            <p className="text-lg text-emerald-100">3 étapes simples pour devenir un héros local</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">1. Signale</h3>
              <p className="text-emerald-100">Prends une photo d'une zone insalubre et géolocalise-la</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">2. Agis</h3>
              <p className="text-emerald-100">Participe aux missions de nettoyage dans ton quartier</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">3. Gagne</h3>
              <p className="text-emerald-100">Collecte des points Himpact et débloque des récompenses</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <Card className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white text-center shadow-2xl border-0">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold mb-4">Prêt à rendre ton quartier ZO ?</h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoins les citoyens qui transforment Abidjan, quartier par quartier
            </p>
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all">
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
