import { useReports } from "@/hooks/useReports";
import { useLeaderboard } from "@/hooks/useGamification";
import { Activity, CheckCircle2, Clock, Users } from "lucide-react";

const OpsStatsBand = () => {
  const { data: reports = [] } = useReports();
  const { data: operators = [] } = useLeaderboard(100);

  const validated = reports.filter((r) => r.status === "validated").length;
  const pending = reports.filter((r) => r.status === "pending").length;

  const stats = [
    { icon: Activity, label: "Photos reçues par Déborah", value: reports.length },
    { icon: CheckCircle2, label: "Missions validées", value: validated },
    { icon: Clock, label: "En cours de vérification", value: pending },
    { icon: Users, label: "Agents sur le terrain", value: operators.length },
  ];


  return (
    <section className="relative border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/70">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-4 h-4 text-accent" />
                  <span className="hud-meta">{s.label}</span>
                </div>
                <p className="font-display text-3xl sm:text-4xl text-foreground tabular-nums">
                  {String(s.value).padStart(2, "0")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OpsStatsBand;
