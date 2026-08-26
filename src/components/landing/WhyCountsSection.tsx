import { useMemo } from "react";
import { Eye, Users, LineChart, Target } from "lucide-react";
import { useReports } from "@/hooks/useReports";

const reasons = [
  {
    icon: Eye,
    code: "RAI-01",
    title: "Ce qu'on ne voit pas ne se règle pas",
    desc: "Un problème resté dans ta rue reste invisible. Sur la carte, il a une photo, une heure et un lieu.",
  },
  {
    icon: Users,
    code: "RAI-02",
    title: "On met les habitants en relation",
    desc: "Habitants, mairies, ONG et services techniques regardent la même carte. La solution vient plus vite.",
  },
  {
    icon: LineChart,
    code: "RAI-03",
    title: "Des données, pas des rumeurs",
    desc: "Chaque mission validée devient une donnée publique qui sert à prioriser les interventions.",
  },
];

/** Objectif d'indice civique à atteindre pour dire que le quartier va mieux. */
const OBJECTIF_HIMPACT = 5000;

const WhyCountsSection = () => {
  const { data: reports = [] } = useReports();

  const indicators = useMemo(() => {
    const visible = reports.filter((r) => r.status !== "rejected");
    const validated = visible.filter((r) => r.status === "validated").length;
    const habitants = new Set(visible.map((r) => r.user)).size;
    const himpact = validated * 10;
    const resolution = visible.length ? Math.round((validated / visible.length) * 100) : 0;
    return { validated, habitants, himpact, resolution };
  }, [reports]);

  const progress = Math.min(100, Math.round((indicators.himpact / OBJECTIF_HIMPACT) * 100));

  return (
    <section id="pourquoi" className="relative overflow-hidden bg-background py-24">
      <div className="hud-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <span className="hud-label">Indice civique</span>
        <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
          Pourquoi ça compte
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
          La Ligne Verte ne se contente pas de collecter des plaintes : elle met les habitants en
          relation avec ceux qui peuvent agir, et suit un indice civique commun. Plus l'indice monte,
          plus le quartier va mieux.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {reasons.map((r) => {
            const Icon = r.icon;
            return (
              <article key={r.code} className="hud-panel h-full p-6">
                <div className="mb-4 flex items-center justify-between">
                  <Icon className="h-6 w-6 text-accent" />
                  <span className="hud-meta">{r.code}</span>
                </div>
                <h3 className="font-display text-lg uppercase tracking-wide">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.desc}</p>
              </article>
            );
          })}
        </div>

        {/* Indicateurs civiques */}
        <div className="hud-panel mt-8 p-6 lg:p-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <span className="hud-label flex items-center gap-2">
              <Target className="h-4 w-4" />
              Objectif quartier zo
            </span>
            <span className="hud-meta">
              {indicators.himpact} / {OBJECTIF_HIMPACT} HIMPACT
            </span>
          </div>

          <div className="h-2 w-full border border-border/70 bg-surface">
            <div
              className="h-full bg-accent transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-px border border-border/60 bg-border/60 lg:grid-cols-4">
            {[
              { k: "Missions validées", v: indicators.validated },
              { k: "Habitants mobilisés", v: indicators.habitants },
              { k: "Taux de validation", v: `${indicators.resolution}%` },
              { k: "Indice atteint", v: `${progress}%` },
            ].map((s) => (
              <div key={s.k} className="bg-card p-4">
                <p className="hud-meta">{s.k}</p>
                <p className="font-display text-2xl text-accent">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyCountsSection;
