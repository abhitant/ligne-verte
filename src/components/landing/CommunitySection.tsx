import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useLeaderboard } from "@/hooks/useGamification";
import DeboraSay from "@/components/landing/DeboraSay";


const CommunitySection = () => {
  const { data: users = [] } = useLeaderboard(10);

  return (
    <section id="reconnaissance" className="relative py-24 bg-surface/30 overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <DeboraSay
            pose="wave"
            line="Contribue et sois reconnu."
            className="lg:justify-self-start"
          />

          <div>
            <span className="hud-label">Reconnaissance</span>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              Contribue et sois <span className="text-accent">reconnu</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Chaque signalement validé compte : une mission repérée, un quartier un peu plus
              propre, une action visible par tout le monde. Ta régularité te place sur le
              classement public. Tes contributions deviennent une preuve concrète de ton engagement
              pour le quartier et peuvent donner accès aux avantages proposés par La Ligne Verte.
            </p>
            <Link to="/classement" className="mt-5 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline">
              Découvrir le classement →
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1">
          {/* Classement opérateurs */}
          <div className="hud-panel p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="hud-label flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Classement en direct
              </span>
              <span className="hud-meta">SCORE</span>
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
                  <p className="font-display uppercase tracking-wide text-sm">Le classement se prépare</p>
                  <p className="hud-meta mt-1">En attente de contributions…</p>
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
