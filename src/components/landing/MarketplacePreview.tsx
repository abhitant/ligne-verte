
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Smartphone, ShoppingBag, Star, ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const MarketplacePreview = () => {
  const featuredRewards = [
    {
      id: '1',
      name: 'Crédit Orange 1000 FCFA',
      points: 500,
      image: '📱',
      popular: true,
      category: 'Télécom'
    },
    {
      id: '2',  
      name: 'Bon Carrefour 5000 FCFA',
      points: 2000,
      image: '🛒',
      popular: false,
      category: 'Shopping'
    },
    {
      id: '3',
      name: 'Kit jardinage écologique',
      points: 1500,
      image: '🌱',
      popular: true,
      category: 'Écologique'
    }
  ];

  const pointsWays = [
    {
      action: "Signalement validé",
      points: 50,
      icon: "📸",
      color: "bg-green-100 text-green-800"
    },
    {
      action: "Zone critique nettoyée", 
      points: 200,
      icon: "🧹",
      color: "bg-blue-100 text-blue-800"
    },
    {
      action: "Action communautaire",
      points: 500,
      icon: "👥",
      color: "bg-purple-100 text-purple-800"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Gift className="w-4 h-4 mr-2" />
            MARKETPLACE HIMPACT
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transforme tes points en récompenses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Chaque action pour l'environnement te rapporte des points Himpact.
            Échange-les contre des récompenses concrètes !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Featured Rewards */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Star className="w-6 h-6 mr-2 text-yellow-500" />
              Récompenses populaires
            </h3>
            
            <div className="space-y-4 mb-8">
              {featuredRewards.map((reward) => (
                <Card key={reward.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{reward.image}</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900">{reward.name}</h4>
                            {reward.popular && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Populaire
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {reward.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 flex items-center">
                          <Zap className="w-5 h-5 mr-1" />
                          {reward.points}
                        </div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Link to="/marketplace">
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Voir toutes les récompenses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* How to earn points */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              Comment gagner des points ?
            </h3>

            <div className="space-y-6 mb-8">
              {pointsWays.map((way, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{way.icon}</div>
                        <div>
                          <h4 className="font-bold text-gray-900">{way.action}</h4>
                          <Badge className={`${way.color} text-xs mt-1`}>
                            Action citoyenne
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">
                          +{way.points}
                        </div>
                        <div className="text-sm text-gray-500">points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Current User Stats Simulation */}
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Tes points actuels
                </h4>
                <div className="text-3xl font-bold mb-2">0 points</div>
                <p className="text-green-100 mb-4">
                  Commence à signaler pour gagner tes premiers points !
                </p>
                <Button className="bg-card text-primary hover:bg-card/80">
                  Faire mon premier signalement
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePreview;
