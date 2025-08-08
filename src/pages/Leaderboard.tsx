import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useGamification";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LeaderboardPage = () => {
  const { data: leaderboard = [], isLoading } = useLeaderboard(100);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Map preview with green tint */}
      <div className="absolute inset-0 z-0">
        <MapContainer
          center={[5.3478, -4.0267]}
          zoom={12}
          attributionControl={false}
          zoomControl={false}
          dragging={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
          style={{ height: '100%', width: '100%' }}
          className="pointer-events-none"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
        <div className="absolute inset-0 bg-accent/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/carte">
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-primary/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la carte
              </Button>
            </Link>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">🏆 Classement Complet</h1>
            <p className="text-muted-foreground">Découvrez tous les champions de l'environnement</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-4">
        <Card className="bg-background border border-border shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground text-xl">
              <Trophy className="w-6 h-6 text-accent" />
              Classement Général
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Tous les utilisateurs classés par points Himpact
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chargement du classement...</p>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-accent" />
                <p className="text-foreground font-medium">Aucun utilisateur dans le classement</p>
                <p className="text-muted-foreground">Soyez le premier à signaler !</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div 
                  key={user.telegram_id} 
                  className={`flex items-center gap-3 p-4 rounded-xl transition-all hover:shadow-lg border ${
                    index < 3 
                      ? 'bg-accent/10 border-accent/30' 
                      : 'bg-background/30 backdrop-blur-md border-border/50'
                  }`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg border ${
                    index < 3 ? 'bg-accent text-accent-foreground border-accent/30' : 'bg-primary/60 text-primary-foreground border-primary/30'
                  }`}>
                    {index < 3 ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-lg">{user.pseudo}</p>
                    <p className="text-sm text-muted-foreground">{user.reports_count || 0} signalements effectués</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-2xl ${index < 3 ? 'text-accent' : 'text-foreground'}`}>{user.points_himpact}</p>
                    <p className="text-sm text-muted-foreground">points Himpact</p>
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