import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Target } from "lucide-react";

interface UserStats {
  pseudo: string;
  experience_points: number;
  level_current: number;
  reports_count: number;
  cleanups_count: number;
  streak_days: number;
  badges: string[];
  rank?: number;
}

interface UserProfileProps {
  userStats: UserStats;
  className?: string;
}

const getUserLevelInfo = (level: number) => {
  const levels = [
    { level: 1, name: "Débutant", color: "bg-gray-400", points: 0 },
    { level: 2, name: "Observateur", color: "bg-green-400", points: 50 },
    { level: 3, name: "Citoyen Actif", color: "bg-blue-400", points: 150 },
    { level: 4, name: "Éco-Guerrier", color: "bg-purple-400", points: 300 },
    { level: 5, name: "Champion", color: "bg-yellow-400", points: 500 },
    { level: 6, name: "Héros Vert", color: "bg-emerald-500", points: 750 },
    { level: 7, name: "Légende", color: "bg-orange-500", points: 1100 },
    { level: 8, name: "Maître", color: "bg-red-500", points: 1500 },
    { level: 9, name: "Gardien", color: "bg-indigo-600", points: 2000 },
    { level: 10, name: "Protecteur Suprême", color: "bg-gradient-to-r from-purple-600 to-pink-600", points: 2600 }
  ];
  
  return levels.find(l => l.level === level) || levels[0];
};

const getProgressToNextLevel = (currentXP: number, currentLevel: number) => {
  const currentLevelInfo = getUserLevelInfo(currentLevel);
  const nextLevelInfo = getUserLevelInfo(currentLevel + 1);
  
  if (currentLevel >= 10) {
    return { progress: 100, remaining: 0, next: nextLevelInfo.points };
  }
  
  const progressPoints = currentXP - currentLevelInfo.points;
  const totalNeeded = nextLevelInfo.points - currentLevelInfo.points;
  const progress = (progressPoints / totalNeeded) * 100;
  
  return {
    progress: Math.min(progress, 100),
    remaining: Math.max(nextLevelInfo.points - currentXP, 0),
    next: nextLevelInfo.points
  };
};

const UserProfile = ({ userStats, className }: UserProfileProps) => {
  const levelInfo = getUserLevelInfo(userStats.level_current);
  const progressInfo = getProgressToNextLevel(userStats.experience_points, userStats.level_current);

  return (
    <Card className={`bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full ${levelInfo.color} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
            {userStats.level_current}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{userStats.pseudo}</h3>
            <p className="text-sm text-green-600 font-medium">{levelInfo.name}</p>
          </div>
          {userStats.rank && (
            <Badge variant="secondary" className="ml-auto">
              Rang #{userStats.rank}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Experience Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Expérience</span>
            <span className="font-medium">
              {userStats.experience_points} XP
              {userStats.level_current < 10 && ` / ${progressInfo.next} XP`}
            </span>
          </div>
          <Progress value={progressInfo.progress} className="h-2" />
          {userStats.level_current < 10 && (
            <p className="text-xs text-gray-500">
              {progressInfo.remaining} XP pour le niveau suivant
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-2xl font-bold text-blue-600">{userStats.reports_count}</span>
            </div>
            <p className="text-xs text-gray-600">Signalements</p>
          </div>
          
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-2xl font-bold text-green-600">{userStats.cleanups_count}</span>
            </div>
            <p className="text-xs text-gray-600">Nettoyages</p>
          </div>
          
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-2xl font-bold text-orange-600">{userStats.streak_days}</span>
            </div>
            <p className="text-xs text-gray-600">Série (jours)</p>
          </div>
          
          <div className="bg-card rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-2xl font-bold text-purple-600">{userStats.experience_points}</span>
            </div>
            <p className="text-xs text-gray-600">Points XP</p>
          </div>
        </div>

        {/* Badges */}
        {userStats.badges && userStats.badges.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Badges obtenus</p>
            <div className="flex flex-wrap gap-1">
              {userStats.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;