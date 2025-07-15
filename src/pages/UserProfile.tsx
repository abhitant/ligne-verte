import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Gift, MapPin, Calendar, TrendingUp, Zap, Target, Medal, Users, Camera, CheckCircle } from "lucide-react";

interface UserStats {
  totalPoints: number;
  level: number;
  reportsCount: number;
  validatedReports: number;
  rank: number;
  nextLevelPoints: number;
  commune: string;
  joinDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  points: number;
  unlockedDate?: string;
}

const UserProfile = () => {
  const [userStats] = useState<UserStats>({
    totalPoints: 1247,
    level: 5,
    reportsCount: 28,
    validatedReports: 24,
    rank: 12,
    nextLevelPoints: 1500,
    commune: "Cocody",
    joinDate: "2024-01-15"
  });

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Premier Pas',
      description: 'Premier signalement effectué',
      icon: '🎯',
      unlocked: true,
      points: 50,
      unlockedDate: '2024-01-15'
    },
    {
      id: '2',
      title: 'Éclaireur',
      description: '5 signalements validés',
      icon: '🔍',
      unlocked: true,
      points: 100,
      unlockedDate: '2024-01-20'
    },
    {
      id: '3',
      title: 'Gardien du Quartier',
      description: '25 signalements validés',
      icon: '🛡️',
      unlocked: true,
      points: 250,
      unlockedDate: '2024-02-10'
    },
    {
      id: '4',
      title: 'Héros Local',
      description: '50 signalements validés',
      icon: '🦸‍♂️',
      unlocked: false,
      points: 500
    },
    {
      id: '5',
      title: 'Champion',
      description: 'Top 10 de votre commune',
      icon: '🏆',
      unlocked: true,
      points: 300,
      unlockedDate: '2024-02-15'
    },
    {
      id: '6',
      title: 'Ambassadeur',
      description: '100 signalements validés',
      icon: '👑',
      unlocked: false,
      points: 1000
    }
  ]);

  const recentActivities = [
    {
      id: '1',
      type: 'signalement',
      location: 'Rue de la Paix, Cocody',
      date: '2024-01-20',
      status: 'validated',
      points: 50,
      icon: Camera
    },
    {
      id: '2',
      type: 'verification',
      location: 'Boulevard Lagunaire, Yopougon',
      date: '2024-01-18',
      status: 'validated',
      points: 30,
      icon: CheckCircle
    },
    {
      id: '3',
      type: 'mission',
      location: 'Marché de Cocody',
      date: '2024-01-15',
      status: 'completed',
      points: 200,
      icon: Target
    }
  ];

  const progressToNextLevel = (userStats.totalPoints / userStats.nextLevelPoints) * 100;
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Légende';
    if (level >= 7) return 'Champion';
    if (level >= 5) return 'Gardien';
    if (level >= 3) return 'Éclaireur';
    return 'Débutant';
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'text-purple-600';
    if (level >= 7) return 'text-yellow-600';
    if (level >= 5) return 'text-blue-600';
    if (level >= 3) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">👤 Mon Profil Héros</h1>
          <p className="text-lg text-gray-600">Suis tes contributions et ton impact sur Abidjan</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte de Profil */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-3xl">🦸‍♀️</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Aminata Traoré</h2>
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-5 h-5" />
                        <span className={`text-xl font-bold ${getLevelColor(userStats.level)}`} style={{color: 'white'}}>
                          Niveau {userStats.level} - {getLevelTitle(userStats.level)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <span>📍 {userStats.commune}</span>
                        <span>📅 Depuis {new Date(userStats.joinDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{userStats.totalPoints}</div>
                    <div className="text-sm opacity-90">Points Himpact</div>
                    <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/30">
                      #{userStats.rank} à {userStats.commune}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Progression vers niveau {userStats.level + 1}</span>
                    <span>{userStats.totalPoints}/{userStats.nextLevelPoints} points</span>
                  </div>
                  <Progress value={progressToNextLevel} className="h-3 bg-white/20" />
                  <div className="text-sm opacity-90">
                    Plus que {userStats.nextLevelPoints - userStats.totalPoints} points pour le niveau suivant !
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Statistiques Détaillées */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-card shadow-lg text-center border-l-4 border-l-accent">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-green-600 mb-1">{userStats.reportsCount}</div>
                  <div className="text-sm text-gray-600">Signalements</div>
                  <div className="text-xs text-green-600 mt-1">Total effectués</div>
                </CardContent>
              </Card>
              <Card className="bg-card shadow-lg text-center border-l-4 border-l-primary">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-blue-600 mb-1">{userStats.validatedReports}</div>
                  <div className="text-sm text-gray-600">Validés</div>
                  <div className="text-xs text-blue-600 mt-1">Impact confirmé</div>
                </CardContent>
              </Card>
              <Card className="bg-card shadow-lg text-center border-l-4 border-l-muted">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {Math.round((userStats.validatedReports / userStats.reportsCount) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Précision</div>
                  <div className="text-xs text-purple-600 mt-1">Taux de réussite</div>
                </CardContent>
              </Card>
              <Card className="bg-card shadow-lg text-center border-l-4 border-l-secondary">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-yellow-600 mb-1">{unlockedAchievements.length}</div>
                  <div className="text-sm text-gray-600">Badges</div>
                  <div className="text-xs text-yellow-600 mt-1">Débloqués</div>
                </CardContent>
              </Card>
            </div>

            {/* Activités Récentes */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Activités Récentes
                </CardTitle>
                <CardDescription>Tes dernières contributions à La Ligne Verte</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const IconComponent = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium capitalize">{activity.type}</div>
                            <div className="text-sm text-gray-600">{activity.location}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(activity.date).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">+{activity.points}</div>
                          <div className="text-xs text-gray-500">points</div>
                          <Badge variant="secondary" className="mt-1">
                            {activity.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Prochain Badge */}
            {nextAchievement && (
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Target className="w-5 h-5" />
                    Prochain Badge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl mb-2 grayscale">{nextAchievement.icon}</div>
                    <h3 className="font-bold text-yellow-800 mb-1">{nextAchievement.title}</h3>
                    <p className="text-sm text-yellow-700 mb-3">{nextAchievement.description}</p>
                    <Badge className="bg-yellow-500 text-white">
                      +{nextAchievement.points} points
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Collection de Badges */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="w-5 h-5 text-purple-600" />
                  Mes Badges ({unlockedAchievements.length}/{achievements.length})
                </CardTitle>
                <CardDescription>
                  Ta collection de récompenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-3 border rounded-lg text-center ${
                        achievement.unlocked 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className={`text-2xl mb-2 ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div className={`font-medium text-sm ${achievement.unlocked ? 'text-green-800' : 'text-gray-500'}`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {achievement.unlocked && achievement.unlockedDate && (
                          <span>Débloqué le {new Date(achievement.unlockedDate).toLocaleDateString('fr-FR')}</span>
                        )}
                      </div>
                      <div className="text-xs font-medium text-blue-600 mt-1">
                        +{achievement.points} pts
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Classement */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Classement {userStats.commune}
                </CardTitle>
                <CardDescription>
                  Ta position dans ta commune
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🥇</span>
                      <span className="font-medium">Kouassi M.</span>
                    </div>
                    <span className="font-bold text-yellow-600">2,150 pts</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">#{userStats.rank}</span>
                      <span className="font-medium">Toi</span>
                    </div>
                    <span className="font-bold text-green-600">{userStats.totalPoints} pts</span>
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-4">
                    <p>Continue comme ça ! Tu progresses bien 🚀</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Rapides */}
            <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Actions Rapides
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Camera className="w-4 h-4 mr-2" />
                  Nouveau Signalement
                </Button>
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Gift className="w-4 h-4 mr-2" />
                  Voir Récompenses
                </Button>
                <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Users className="w-4 h-4 mr-2" />
                  Défier un Ami
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
