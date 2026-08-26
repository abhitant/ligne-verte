import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Radar, Activity, ShieldCheck, Clock, Users } from "lucide-react";
import OpenStreetMap from "@/components/OpenStreetMap";
import { useReports } from "@/hooks/useReports";

const TacticalMap = () => {
  const { data: reports = [] } = useReports();

  const stats = useMemo(() => {
    const visible = reports.filter((r) => r.status !== "rejected");
    const validated = visible.filter((r) => r.status === "validated").length;
    const pending = visible.filter((r) => r.status === "pending").length;
    const agents = new Set(visible.map((r) => r.user)).size;
    return { total: visible.length, validated, pending, agents };
  }, [reports]);

  const items = [
    { icon: Activity, label: "Signalements sur la carte", value: stats.total, tone: "text-accent" },
    { icon: ShieldCheck, label: "Missions validées", value: stats.validated, tone: "text-signal" },
    { icon: Clock, label: "En vérification", value: stats.pending, tone: "text-alert" },
    { icon: Users, label: "Habitants mobilisés", value: stats.agents, tone: "text-info" },
  ];

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

        <span className="pointer-events-none absolute right-3 top-3 z-[1000] font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent/80">
          LIVE ●
        </span>
      </div>

      {/* Bandeau d'informations */}
      <div className="grid grid-cols-2 gap-px bg-border/60 lg:grid-cols-4">
        {items.map(({ icon: Icon, label, value, tone }) => (
          <div key={label} className="bg-card px-4 py-5">
            <Icon className={`mb-3 h-4 w-4 ${tone}`} />
            <p className={`font-mono text-2xl ${tone}`}>{String(value).padStart(2, "0")}</p>
            <p className="hud-meta mt-1 leading-tight">{label}</p>
          </div>
        ))}
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
