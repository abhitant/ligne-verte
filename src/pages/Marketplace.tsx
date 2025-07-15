
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Smartphone, ShoppingBag, Leaf, Star, Users, Zap } from "lucide-react";

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  category: 'telecom' | 'shopping' | 'eco' | 'premium';
  image: string;
  available: number;
  popular?: boolean;
}

const Marketplace = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [userPoints] = useState(2150); // Points simulés de l'utilisateur

  const rewards: Reward[] = [
    {
      id: '1',
      name: 'Crédit Orange 1000 FCFA',
      description: 'Rechargez votre mobile Orange',
      points: 500,
      category: 'telecom',
      image: '📱',
      available: 25,
      popular: true
    },
    {
      id: '2',
      name: 'Crédit MTN 2000 FCFA',
      description: 'Rechargez votre mobile MTN',
      points: 900,
      category: 'telecom',
      image: '📞',
      available: 15
    },
    {
      id: '3',
      name: 'Bon d\'achat Carrefour 5000 FCFA',
      description: 'Utilisable dans tous les magasins Carrefour',
      points: 2000,
      category: 'shopping',
      image: '🛒',
      available: 8
    },
    {
      id: '4',
      name: 'Kit de jardinage écologique',
      description: 'Graines, outils et guide pour jardin urbain',
      points: 1500,
      category: 'eco',
      image: '🌱',
      available: 12,
      popular: true
    },
    {
      id: '5',
      name: 'Sac réutilisable en jute',
      description: 'Sac écologique fait localement',
      points: 800,
      category: 'eco',
      image: '👜',
      available: 20
    },
    {
      id: '6',
      name: 'Formation environnement premium',
      description: 'Accès aux formations avancées',
      points: 3000,
      category: 'premium',
      image: '🎓',
      available: 5
    }
  ];

  const categories = [
    { id: 'all', name: 'Tous', icon: Gift },
    { id: 'telecom', name: 'Télécom', icon: Smartphone },
    { id: 'shopping', name: 'Achats', icon: ShoppingBag },
    { id: 'eco', name: 'Écologique', icon: Leaf },
    { id: 'premium', name: 'Premium', icon: Star }
  ];

  const filteredRewards = selectedCategory === 'all' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'telecom': return 'bg-blue-100 text-blue-800';
      case 'shopping': return 'bg-purple-100 text-purple-800';
      case 'eco': return 'bg-green-100 text-green-800';
      case 'premium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canAfford = (points: number) => userPoints >= points;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-accent/20 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">💎 Marketplace Himpact</h1>
          <p className="text-lg text-muted-foreground">Échangez vos points contre des récompenses</p>
        </div>

        {/* User Points */}
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              Mes Points Himpact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{userPoints.toLocaleString()} points</div>
            <p className="text-primary-foreground/80">Continue à signaler pour gagner plus de points !</p>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRewards.map((reward) => (
            <Card key={reward.id} className="bg-card shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="text-4xl mb-2">{reward.image}</div>
                  <div className="flex flex-col items-end gap-2">
                    {reward.popular && (
                      <Badge className="bg-red-100 text-red-800">
                        <Star className="w-3 h-3 mr-1" />
                        Populaire
                      </Badge>
                    )}
                    <Badge className={getCategoryColor(reward.category)}>
                      {categories.find(c => c.id === reward.category)?.name}
                    </Badge>
                  </div>
                </div>
                <CardTitle className="text-lg">{reward.name}</CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-2xl font-bold text-green-600">
                    {reward.points} pts
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {reward.available} disponibles
                  </div>
                </div>
                <Button 
                  className={`w-full ${canAfford(reward.points) 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  disabled={!canAfford(reward.points)}
                >
                  {canAfford(reward.points) ? 'Échanger' : 'Points insuffisants'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <Card className="bg-blue-50 border-blue-200 mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Gift className="w-6 h-6" />
              Comment gagner plus de points ?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">+50</span>
                </div>
                <span>Signalement validé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">+100</span>
                </div>
                <span>Photo de qualité</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold">+200</span>
                </div>
                <span>Zone critique nettoyée</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Marketplace;
