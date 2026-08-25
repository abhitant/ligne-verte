import { Button } from "@/components/ui/button";
import { MapPin, Trophy, Radar } from "lucide-react";
import { Link } from "react-router-dom";
import OpenStreetMap from "@/components/OpenStreetMap";
import { useLeaderboard } from "@/hooks/useGamification";

const CommunitySection = () => {
  const { data: users = [] } = useLeaderboard(10);

  return (
    <section id="carte-live" className="relative py-24 bg-surface/30 overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="hud-label mb-4">Débora // mon tableau de bord</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              Regarde ce que <span className="text-accent">la cité</span> m'envoie
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            « Chaque signalement que je valide s'affiche ici en direct. Plus vous êtes nombreux à
            m'écrire, plus la carte devient précise — et plus vos points montent. »
          </p>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte tactique */}
          <div className="lg:col-span-2 hud-panel p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="hud-label flex items-center gap-2">
                <Radar className="w-4 h-4" />
                Carte tactique · live
              </span>
              <span className="hud-meta">SECTEUR ABJ</span>
            </div>
            <div className="h-[420px] overflow-hidden border border-border/70">
              <OpenStreetMap
                reports={[]}
                selectedReport={null}
                onReportSelect={() => {}}
                filter="all"
              />
            </div>
            <Link to="/carte" className="block mt-4">
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-display uppercase tracking-widest">
                <MapPin className="w-5 h-5 mr-2" />
                Accéder à la carte
              </Button>
            </Link>
          </div>

          {/* Classement opérateurs */}
          <div className="hud-panel p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="hud-label flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Top opérateurs
              </span>
              <span className="hud-meta">HIMPACT</span>
            </div>

            <div className="flex-1 space-y-px bg-border/60 border border-border/60">
              {users.slice(0, 5).map((user, index) => (
                <div
                  key={`${user.pseudo}-${index}`}
                  className="flex items-center gap-3 bg-card p-4 hover:bg-surface transition-colors"
                >
                  <span className="font-mono text-xs text-accent w-6">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display uppercase tracking-wide truncate">{user.pseudo}</p>
                    <p className="hud-meta">{user.reports_count || 0} missions</p>
                  </div>
                  <span className="font-mono text-accent text-sm">{user.points_himpact}</span>
                </div>
              ))}

              {users.length === 0 && (
                <div className="bg-card p-8 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-3 text-accent/60" />
                  <p className="font-display uppercase tracking-wide text-sm">Aucun opérateur</p>
                  <p className="hud-meta mt-1">En attente de recrues…</p>
                </div>
              )}
            </div>

            <Link to="/classement" className="block mt-4">
              <Button
                variant="outline"
                className="w-full border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground font-mono text-xs uppercase tracking-[0.2em] bg-transparent"
              >
                Voir le classement complet
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
