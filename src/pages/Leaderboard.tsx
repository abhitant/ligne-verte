import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useGamification";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const LeaderboardPage = () => {
  const { data: leaderboard = [], isLoading } = useLeaderboard(100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary shadow-lg p-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/map">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la carte
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">🏆 Classement Complet</h1>
            <p className="text-primary-foreground/90">Découvrez tous les champions de l'environnement</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary-foreground text-xl">
              <Trophy className="w-6 h-6 text-accent" />
              Classement Général
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Tous les utilisateurs classés par points Himpact
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-accent/20">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/5" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-accent" />
                <p className="text-primary-foreground font-medium">Aucun utilisateur dans le classement</p>
                <p className="text-primary-foreground/80">Soyez le premier à signaler !</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div 
                  key={user.telegram_id} 
                  className={`flex items-center gap-3 p-4 rounded-lg transition-all hover:shadow-md ${
                    index < 3 
                      ? 'bg-accent text-accent-foreground hover:bg-accent/80 border-2 border-accent-foreground/20' 
                      : 'bg-accent text-accent-foreground hover:bg-accent/80'
                  }`}
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-foreground text-accent font-bold text-lg">
                    {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-accent-foreground text-lg">{user.pseudo}</p>
                    <p className="text-sm text-accent-foreground/80">{user.reports_count || 0} signalements effectués</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-accent-foreground text-2xl">{user.points_himpact}</p>
                    <p className="text-sm text-accent-foreground/80">points Himpact</p>
                  </div>
                  {index < 3 && (
                    <div className="text-accent text-2xl">
                      ⭐
                    </div>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeaderboardPage;