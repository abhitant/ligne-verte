import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft } from "lucide-react";
import { useLeaderboard } from "@/hooks/useGamification";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const LeaderboardPage = () => {
  const { data: leaderboard = [], isLoading } = useLeaderboard(100);

  return (
    <div className="relative min-h-screen">
      {/* Carte tactique en fond */}
      <div className="fixed inset-0 z-0">
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
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </MapContainer>
        <div className="absolute inset-0 bg-background/90" />
        <div className="absolute inset-0 hud-grid opacity-40" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <Link to="/carte">
          <Button variant="ghost" size="sm" className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:bg-accent/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la carte
          </Button>
        </Link>

        <div className="hud-panel p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="hud-label flex items-center gap-2">
              <Trophy className="w-4 h-4" /> Classement des opérateurs
            </span>
            <span className="hud-meta">{leaderboard.length} actifs</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-1">
            Tableau d'<span className="text-accent">honneur</span>
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Classement par points Himpact accumulés sur les missions validées.
          </p>

          {isLoading ? (
            <p className="hud-meta py-10 text-center">Chargement des données…</p>
          ) : leaderboard.length === 0 ? (
            <div className="py-14 text-center">
              <Trophy className="w-10 h-10 mx-auto mb-4 text-accent/60" />
              <p className="font-display uppercase tracking-wide">Aucun opérateur enregistré</p>
              <p className="hud-meta mt-1">Sois le premier à lancer une mission.</p>
            </div>
          ) : (
            <ol className="space-y-px bg-border/60 border border-border/60">
              {leaderboard.map((user, index) => (
                <li
                  key={`${user.pseudo}-${user.rank}`}
                  className={`flex items-center gap-4 p-4 transition-colors hover:bg-surface ${
                    index < 3 ? 'bg-accent/10' : 'bg-card'
                  }`}
                >
                  <span
                    className={`font-mono text-sm w-10 h-10 flex items-center justify-center border ${
                      index < 3
                        ? 'border-accent text-accent'
                        : 'border-border text-muted-foreground'
                    }`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display uppercase tracking-wide text-lg truncate">{user.pseudo}</p>
                    <p className="hud-meta">{user.reports_count || 0} missions</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-display text-2xl tabular-nums ${index < 3 ? 'text-accent' : 'text-foreground'}`}>
                      {user.points_himpact}
                    </p>
                    <p className="hud-meta">Himpact</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
