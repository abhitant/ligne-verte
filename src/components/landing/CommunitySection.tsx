import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import OpenStreetMap from "@/components/OpenStreetMap";
import Leaderboard from "@/components/gamification/Leaderboard";
import { useLeaderboard } from "@/hooks/useGamification";

const CommunitySection = () => {
  const { data: users = [] } = useLeaderboard(10);

  return (
    <div className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Nous sommes en guerre
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Guerre contre les déchets: chaque action compte. Rejoins le mouvement et transforme ton quartier en gagnant des points Himpact.
          </p>
        </div>

        {/* Éléments visuels - Style Gaming */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Carte - Style Gaming */}
          <Card className="bg-primary text-primary-foreground border-2 border-accent/50 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent"></div>
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="flex items-center gap-2 text-accent font-bold text-lg tracking-wider">
                <MapPin className="w-5 h-5 text-accent animate-pulse" />
                ZONE D'OPÉRATION
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative z-10">
              <div className="h-96 rounded-b-lg overflow-hidden border-t-2 border-accent/30">
                <OpenStreetMap 
                  reports={[]}
                  selectedReport={null}
                  onReportSelect={() => {}}
                  filter="all"
                />
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard - Style Gaming */}
          <Card className="bg-primary text-primary-foreground border-2 border-accent/50 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent"></div>
            <CardHeader className="relative z-10 pb-2">
              <CardTitle className="flex items-center gap-2 text-accent font-bold text-lg tracking-wider">
                <Trophy className="w-5 h-5 text-accent animate-pulse" />
                🏆 LES PLUS HIMPACTANTS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 relative z-10 border-t-2 border-accent/30">
              <div className="h-80 overflow-y-auto">
                <div className="space-y-3">
                  {users.slice(0, 3).map((user, index) => (
                    <div 
                      key={user.pseudo + index} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-accent/20 border border-accent/40 hover:bg-accent/30 transition-all"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold text-lg border-2 border-accent-foreground shadow-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-primary-foreground text-sm tracking-wide">{user.pseudo}</p>
                        <p className="text-xs text-accent font-bold">{user.points_himpact} PTS</p>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-8 text-primary-foreground/80">
                      <div className="w-12 h-12 mx-auto mb-2 bg-accent/20 rounded-full flex items-center justify-center border-2 border-accent/40">
                        <Trophy className="w-6 h-6 text-accent" />
                      </div>
                      <p className="font-bold text-sm tracking-wider">AUCUN HÉROS</p>
                      <p className="text-xs text-accent">En attente de recrues...</p>
                    </div>
                  )}
                  
                  {/* Bouton Voir Plus */}
                  <div className="pt-4">
                    <Link to="/classement">
                      <Button 
                        size="sm" 
                        className="w-full bg-accent text-accent-foreground hover:bg-accent/80 border-2 border-accent-foreground/20 font-bold text-sm tracking-wider hover:scale-105 transition-transform"
                      >
                        ⚡ VOIR PLUS ⚡
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA - Style Gaming */}
        <div className="text-center">
          <Link to="/map">
            <Button className="bg-accent hover:bg-accent/80 text-accent-foreground px-12 py-6 text-xl font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all border-2 border-accent-foreground/20 tracking-wider">
              <MapPin className="w-6 h-6 mr-3" />
              ACCÉDER À LA CARTE
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;