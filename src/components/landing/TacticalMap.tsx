import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Radar } from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";
import DeboraTypesTicker from "@/components/landing/DeboraTypesTicker";
import { useReports } from "@/hooks/useReports";
import { useLeaderboard } from "@/hooks/useGamification";

const TacticalMap = () => {
  const { data: reports = [] } = useReports();
  const { data: leaders = [] } = useLeaderboard(100);




  const pointsDistributed = useMemo(
    () => leaders.reduce((sum, l) => sum + (l.points_himpact ?? 0), 0),
    [leaders]
  );

  const progress = Math.min(100, Math.round((pointsDistributed / 10000) * 100));


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
      <div className="relative h-[340px] sm:h-[440px] lg:h-[520px] border-y border-border/60">
        <OpenStreetMap
          reports={reports}
          selectedReport={null}
          onReportSelect={() => {}}
          filter="all"
          showLegend={false}
          zoom={11}
        />

        {/* Légende stylisée */}
        <div className="pointer-events-none absolute left-3 top-3 z-[1000] border border-border/70 bg-card/85 px-3 py-2 backdrop-blur-sm">
          <p className="hud-label mb-2">Légende</p>
          <div className="flex items-center gap-2 text-xs text-card-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-signal" /> Validé
          </div>
          <div className="mt-1 flex items-center gap-2 text-xs text-card-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-alert" /> En attente
          </div>
        </div>

        {/* Débora intervient directement sur la carte */}
        <div className="pointer-events-none absolute bottom-2 left-1 z-[1000] sm:bottom-5 sm:left-5">
          <DeboraTypesTicker />
        </div>

        <span className="pointer-events-none absolute right-3 top-3 z-[1000] font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent/80">
          LIVE ●
        </span>
      </div>

      {/* Objectif Impact */}
      <div className="border-t border-border/60 bg-card px-4 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="hud-label mb-1 text-accent">Objectif Impact</p>
            <p className="font-display text-xl uppercase tracking-wide text-foreground sm:text-2xl">
              {pointsDistributed.toLocaleString()} / 10 000 points distribués
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
