import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Medal, Award, Star } from "lucide-react";

interface LeaderboardUser {
  pseudo: string;
  points_himpact: number;
  reports_count: number;
  rank: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  limit?: number;
}

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{rank}</span>;
  }
};

const getRankColor = (rank: number) => {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    case 2:
      return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    case 3:
      return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    default:
      return "bg-white border";
  }
};

const getLevel = (points: number) => Math.floor(points / 100) + 1;
const getProgress = (points: number) => points % 100;
const getBadges = (user: LeaderboardUser) => {
  const badges: string[] = [];
  if (user.reports_count >= 50) badges.push("Commandant");
  else if (user.reports_count >= 25) badges.push("Nettoyeur");
  else if (user.reports_count >= 10) badges.push("Éclaireur");
  if (user.points_himpact >= 500) badges.push("Légende");
  return badges;
};

const Leaderboard = ({ users, limit = 10 }: LeaderboardProps) => {
  const topUsers = users.slice(0, limit);

  return (
    <Card className="bg-card border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Classement des plus Himpactant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Aucun utilisateur dans le classement</p>
            <p className="text-sm mt-1">Soyez le premier à signaler !</p>
          </div>
        ) : (
          topUsers.map((user) => (
            <div
              key={user.pseudo + user.rank}
              className={`p-4 rounded-lg transition-all hover:shadow-md ${getRankColor(user.rank)}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center">
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div>
                    <h4 className={`font-semibold ${user.rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                      {user.pseudo}
                    </h4>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={user.rank <= 3 ? 'text-white/90' : 'text-gray-600'}>
                        {user.reports_count} signalements
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${user.rank <= 3 ? 'text-white' : 'text-green-600'}`}>
                    {user.points_himpact} pts Himpact
                  </div>
                </div>
              </div>

              {/* Progression d'XP et badges */}
              <div className="mt-3 bg-white/70 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2 text-xs font-medium text-gray-700">
                  <span>Niveau {getLevel(user.points_himpact)}</span>
                  <span>{getProgress(user.points_himpact)}/100 XP</span>
                </div>
                <Progress value={getProgress(user.points_himpact)} className="h-2" />
                {getBadges(user).length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getBadges(user).map((b) => (
                      <Badge key={b} variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" /> {b}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

            </div>
          ))
        )}
        
        {users.length > limit && (
          <div className="text-center pt-2">
            <p className="text-sm text-gray-500">
              Et {users.length - limit} autres participants...
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;