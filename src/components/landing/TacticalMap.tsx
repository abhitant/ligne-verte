import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Radar,
  Users,
  CheckCircle,
  Clock,
  Percent,
  ChevronDown,
  Trophy,
  Swords,
} from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";
import DeboraTypesTicker from "@/components/landing/DeboraTypesTicker";
import { useReports } from "@/hooks/useReports";
import { useLeaderboard } from "@/hooks/useGamification";
import { useChallenges, isChallengeActive } from "@/hooks/useChallenges";

const OBJECTIF_HIMPACT = 5000;

const TacticalMap = () => {
  const { data: reports = [] } = useReports();
  const { data: leaderboard = [] } = useLeaderboard(3);
  const { data: challenges = [] } = useChallenges();
  const [openRanking, setOpenRanking] = useState(false);

  const activeChallenges = useMemo(
    () => challenges.filter(isChallengeActive),
    [challenges]
  );

  const { himpact, progress, metrics } = useMemo(() => {
    const visible = reports.filter((r) => r.status !== "rejected");
    const validated = visible.filter((r) => r.status === "validated");
    const pending = visible.filter((r) => r.status === "pending");
    const mobilized = new Set(visible.map((r) => r.user).filter(Boolean));
    const validationRate = visible.length ? Math.round((validated.length / visible.length) * 100) : 0;

    return {
      himpact: validated.length * 10,
      progress: Math.min(100, Math.round(((validated.length * 10) / OBJECTIF_HIMPACT) * 100)),
      metrics: {
        mobilized: mobilized.size,
        validated: validated.length,
        pending: pending.length,
        validationRate,
      },
    };
  }, [reports]);


  return (
    <div className="hud-panel overflow-hidden">
      {/* Barre de titre HUD */}
      <div className="flex items-center justify-between gap-4 border-b border-border/70 px-4 py-3">
        <span className="hud-label flex items-center gap-2">
          <Radar className="h-4 w-4 animate-pulse" />
          Carte tactique · secteur Abidjan
        </span>
        <span className="hud-meta hidden sm:inline">FLUX LIVE // WHATSAPP + TELEGRAM</span>
      </div>




      {/* Carte */}
      <div className="relative h-[420px] sm:h-[460px] lg:h-[520px] border-y border-border/60">
        <OpenStreetMap
          reports={reports}
          selectedReport={null}
          onReportSelect={() => {}}
          filter="all"
          showLegend={false}
          zoom={11}
        />

        {/* Légende : Défi en cours + Classement pliable */}
        <div className="absolute left-2 top-2 z-[1000] flex flex-row flex-wrap gap-2 sm:left-3 sm:top-3">
          {/* Défi en cours */}
          <div className="border border-border/70 bg-card/90 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-xs text-card-foreground">
              <Swords className="h-3.5 w-3.5 text-accent" />
              <span className="font-medium">Défi en cours</span>
              <span className="ml-1 inline-flex h-4 min-w-[1rem] items-center justify-center bg-accent px-1 font-mono text-[0.65rem] text-accent-foreground">
                {activeChallenges.length}
              </span>
            </div>
          </div>

          {/* Classement pliable */}
          <div className="border border-border/70 bg-card/90 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => setOpenRanking((v) => !v)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left"
            >
              <Trophy className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-medium text-card-foreground">Classement</span>
              <ChevronDown
                className={`ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform ${
                  openRanking ? "rotate-180" : ""
                }`}
              />
            </button>
            {openRanking && (
              <div className="border-t border-border/60 px-3 py-2">
                {leaderboard.length === 0 ? (
                  <p className="hud-meta text-[0.65rem]">Aucun classement</p>
                ) : (
                  <ol className="space-y-1.5">
                    {leaderboard.map((user, index) => (
                      <li key={user.telegram_id} className="flex items-center gap-2 text-xs">
                        <span
                          className={`font-mono text-[0.65rem] ${
                            index < 3 ? "text-accent" : "text-muted-foreground"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="max-w-[110px] truncate font-medium text-card-foreground">
                          {user.pseudo}
                        </span>
                        <span className="ml-auto font-mono text-[0.65rem] text-muted-foreground">
                          {user.points_himpact}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
                <Link
                  to="/classement"
                  className="mt-2 block border-t border-border/60 pt-1.5 text-center text-[0.65rem] font-mono uppercase tracking-wider text-accent hover:text-accent/80"
                >
                  Voir tout
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Déborah intervient directement sur la carte */}
        <div className="pointer-events-none absolute bottom-6 left-1 z-[1000] sm:bottom-5 sm:left-5">
          <DeboraTypesTicker />
        </div>

        <span className="pointer-events-none absolute right-3 top-3 z-[1000] hidden sm:block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent/80">
          LIVE ●
        </span>
      </div>

      {/* Objectif Quartier ZO */}
      <div className="border-t border-border/60 bg-card px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="hud-label mb-1 text-accent">Objectif quartier zo</p>
            <p className="font-display text-xl uppercase tracking-wide text-foreground sm:text-2xl">
              {himpact.toLocaleString()} / {OBJECTIF_HIMPACT.toLocaleString()} HIMPACT
            </p>
          </div>
          <p className="font-mono text-3xl text-accent sm:text-4xl">{progress}%</p>
        </div>

        <div className="mt-4 h-3 w-full overflow-hidden bg-surface">
          <div
            className="h-full bg-accent transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Métriques tactiques */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="border border-border/60 bg-surface/60 px-3 py-3">
            <Users className="mb-2 h-4 w-4 text-accent" />
            <p className="font-display text-xl text-foreground sm:text-2xl">{metrics.mobilized}</p>
            <p className="hud-meta mt-1">Habitants mobilisés</p>
          </div>
          <div className="border border-border/60 bg-surface/60 px-3 py-3">
            <Percent className="mb-2 h-4 w-4 text-accent" />
            <p className="font-display text-xl text-foreground sm:text-2xl">{metrics.validationRate}%</p>
            <p className="hud-meta mt-1">Taux de validation</p>
          </div>
          <div className="border border-border/60 bg-surface/60 px-3 py-3">
            <CheckCircle className="mb-2 h-4 w-4 text-accent" />
            <p className="font-display text-xl text-foreground sm:text-2xl">{metrics.validated}</p>
            <p className="hud-meta mt-1">Missions validées</p>
          </div>
          <div className="border border-border/60 bg-surface/60 px-3 py-3">
            <Clock className="mb-2 h-4 w-4 text-alert" />
            <p className="font-display text-xl text-foreground sm:text-2xl">{metrics.pending}</p>
            <p className="hud-meta mt-1">En attente</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Link to="/carte">
          <Button className="w-full bg-accent font-display uppercase tracking-widest text-accent-foreground hover:bg-accent/90">
            <MapPin className="mr-2 h-5 w-5" />
            Ouvrir la carte complète
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TacticalMap;
