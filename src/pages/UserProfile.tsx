
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Gift, MapPin, Calendar, TrendingUp } from "lucide-react";

interface UserStats {
  totalPoints: number;
  level: number;
  reportsCount: number;
  validatedReports: number;
  rank: number;
  nextLevelPoints: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  points: number;
}

const UserProfile = () => {
  const [userStats] = useState<UserStats>({
    totalPoints: 247,
    level: 3,
    reportsCount: 15,
    validatedReports: 12,
    rank: 23,
    nextLevelPoints: 300
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Premier Signalement',
      description: 'Effectuer votre premier signalement',
      icon: '🎯',
      unlocked: true,
      points: 10
    },
    {
      id: '2',
      title: 'Éco-Warrior',
      description: '10 signalements validés',
      icon: '🛡️',
      unlocked: true,
      points: 50
    },
    {
      id: '3',
      title: 'Gardien du Quartier',
      description: '25 signalements validés',
      icon: '👑',
      unlocked: false,
      points: 100
    },
    {
      id: '4',
      title: 'Champion de la Propreté',
      description: '50 signalements validés',
      icon: '🏆',
      unlocked: false,
      points: 200
    }
  ]);

  const recentReports = [
    {
      id: '1',
      location: 'Cocody, Abidjan',
      date: '2024-01-15',
      status: 'validated',
      points: 15
    },
    {
      id: '2',
      location: 'Yopougon, Abidjan',
      date: '2024-01-12',
      status: 'validated',
      points: 12
    },
    {
      id: '3',
      location: 'Adjamé, Abidjan',
      date: '2024-01-10',
      status: 'pending',
      points: 10
    }
  ];

  const rewards = [
    {
      id: '1',
      title: 'Crédit Orange 1000 CFA',
      points: 100,
      available: true
    },
    {
      id: '2',
      title: 'Carte Cadeau Supermarché',
      points: 200,
      available: true
    },
    {
      id: '3',
      title: 'Bon de Transport 5000 CFA',
      points: 150,
      available: true
    },
    {
      id: '4',
      title: 'T-shirt La Ligne Verte',
      points: 300,
      available: false
    }
  ];

  const progressToNextLevel = (userStats.totalPoints / userStats.nextLevelPoints) * 100;

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'text-purple-600';
    if (level >= 3) return 'text-blue-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">👤 Mon Profil Himpact</h1>
          <p className="text-lg text-gray-600">Suivez vos contributions et récupérez vos récompenses</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Stats Card */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">Aminata Traoré</CardTitle>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5" />
                      <span className={`text-xl font-bold ${getLevelColor(userStats.level)}`}>
                        Niveau {userStats.level}
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        #{userStats.rank} au classement
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{userStats.totalPoints}</div>
                    <div className="text-sm opacity-90">Points Himpact</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progression vers niveau {userStats.level + 1}</span>
                    <span>{userStats.totalPoints}/{userStats.nextLevelPoints} points</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-white shadow-lg text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-blue-600">{userStats.reportsCount}</div>
                  <div className="text-sm text-gray-600">Signalements</div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-green-600">{userStats.validatedReports}</div>
                  <div className="text-sm text-gray-600">Validés</div>
                </CardContent>
              </Card>
              <Card className="bg-white shadow-lg text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round((userStats.validatedReports / userStats.reportsCount) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Taux de réussite</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Signalements Récents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          report.status === 'validated' ? 'bg-green-500' : 'bg-yellow-500'
                        }`}></div>
                        <div>
                          <div className="font-medium">{report.location}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(report.date).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">+{report.points}</div>
                        <div className="text-xs text-gray-500">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Récompenses
                </CardTitle>
                <CardDescription>
                  Débloquez des badges en contribuant
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-3 border rounded-lg ${
                        achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span 
                          className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}
                        >
                          {achievement.icon}
                        </span>
                        <div className="flex-1">
                          <div className={`font-medium ${achievement.unlocked ? 'text-green-800' : 'text-gray-500'}`}>
                            {achievement.title}
                          </div>
                          <div className="text-xs text-gray-500">{achievement.description}</div>
                          <div className="text-xs font-medium text-blue-600">
                            +{achievement.points} points
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  Boutique Récompenses
                </CardTitle>
                <CardDescription>
                  Échangez vos points contre des cadeaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rewards.map((reward) => (
                    <div key={reward.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{reward.title}</div>
                        <div className="text-sm font-bold text-blue-600">{reward.points} pts</div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        disabled={!reward.available || userStats.totalPoints < reward.points}
                      >
                        {userStats.totalPoints >= reward.points ? 'Échanger' : 'Points insuffisants'}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Cette Semaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Nouveaux points</span>
                    <span className="font-bold text-green-600">+37</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Signalements</span>
                    <span className="font-bold text-blue-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Position</span>
                    <span className="font-bold text-purple-600">↑ 2 places</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
