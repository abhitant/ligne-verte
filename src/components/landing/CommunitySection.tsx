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
            Rejoins ceux qui agissent déjà
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Des habitants comme toi contribuent chaque jour à rendre nos quartiers plus propres. Rejoins-les et prends tes points.
          </p>
        </div>

        {/* Éléments visuels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Carte */}
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <MapPin className="w-6 h-6 text-accent" />
                🗺️ Carte Ligne Verte
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 rounded-b-lg overflow-hidden">
                <OpenStreetMap 
                  reports={[]}
                  selectedReport={null}
                  onReportSelect={() => {}}
                  filter="all"
                />
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card className="bg-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Trophy className="w-6 h-6 text-accent" />
                🏆 Top Contributeurs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 overflow-y-auto">
                <Leaderboard users={users} limit={10} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/map">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-xl font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all">
              <MapPin className="w-6 h-6 mr-3" />
              Voir la carte
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CommunitySection;