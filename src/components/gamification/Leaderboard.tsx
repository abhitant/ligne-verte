import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Award } from "lucide-react";

interface LeaderboardUser {
  telegram_id: string;
  pseudo: string;
  experience_points: number;
  level_current: number;
  reports_count: number;
  cleanups_count: number;
  rank: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
  currentUserId?: string;
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

const Leaderboard = ({ users, currentUserId, limit = 10 }: LeaderboardProps) => {
  const topUsers = users.slice(0, limit);

  return (
    <Card className="bg-card border-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-500" />
          Classement des Éco-Champions
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
              key={user.telegram_id}
              className={`p-4 rounded-lg transition-all hover:shadow-md ${getRankColor(user.rank)} ${
                currentUserId === user.telegram_id ? 'ring-2 ring-green-500' : ''
              }`}
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
                        Niveau {user.level_current}
                      </span>
                      <span className={user.rank <= 3 ? 'text-white/70' : 'text-gray-400'}>•</span>
                      <span className={user.rank <= 3 ? 'text-white/90' : 'text-gray-600'}>
                        {user.reports_count} signalements
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-lg font-bold ${user.rank <= 3 ? 'text-white' : 'text-green-600'}`}>
                    {user.experience_points} XP
                  </div>
                  {user.cleanups_count > 0 && (
                    <Badge 
                      variant={user.rank <= 3 ? "secondary" : "outline"} 
                      className="text-xs mt-1"
                    >
                      {user.cleanups_count} nettoyages
                    </Badge>
                  )}
                </div>
              </div>

              {currentUserId === user.telegram_id && (
                <div className="mt-2 pt-2 border-t border-white/20">
                  <p className="text-xs text-white/90 font-medium">C'est vous ! 🎉</p>
                </div>
              )}
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