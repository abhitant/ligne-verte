import { useEffect } from "react";
import { Target, Zap, Trophy, ShieldCheck, Cpu, Users } from "lucide-react";

const About = () => {
  useEffect(() => {
    document.title = "Intel | La Ligne Verte — Gestion civique des cités";
    const desc = "La Ligne Verte : centre de commandement citoyen. Signale tout désagrément de ta cité via Débora, suis la carte tactique et gagne des points Himpact.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;
  }, []);

  const steps = [
    { icon: Target, title: "01 · Repère", desc: "Un problème dans ta cité : déchets, caniveau, éclairage, voirie, nuisance." },
    { icon: Zap, title: "02 · Signale", desc: "Photo + localisation envoyées à Débora sur WhatsApp ou Telegram." },
    { icon: Trophy, title: "03 · Gagne", desc: "Signalement validé = points Himpact cumulables et montée au classement." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="relative" role="main">
        <section className="relative border-b border-border overflow-hidden">
          <div className="absolute inset-0 hud-grid opacity-40 pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 py-20">
            <p className="hud-label mb-4">Dossier · Intel</p>
            <h1 className="font-display text-4xl md:text-6xl uppercase tracking-tight leading-[0.95]">
              Rends ta cité <span className="text-accent text-glow">zo</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              La Ligne Verte est un projet open source de GreenPill Côte d'Ivoire. Nous transformons
              la gestion civique des cités en mission collective : chaque désagrément signalé devient
              une donnée ouverte et localisée, exploitable par les habitants comme par les institutions.
            </p>
          </div>
        </section>

        {/* Le défi */}
        <section aria-labelledby="defi" className="max-w-6xl mx-auto px-4 py-16">
          <p className="hud-label mb-4">Situation</p>
          <h2 id="defi" className="font-display text-2xl md:text-4xl uppercase mb-8">
            Le défi urbain
          </h2>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Toutes les grandes villes africaines mènent la même bataille : déchets, assainissement,
                éclairage, voirie. Ces désagréments dégradent le quotidien et restent souvent invisibles
                dans les données publiques.
              </p>
              <p>
                Dans le Grand Abidjan, <span className="text-accent font-medium">1,4 million de tonnes</span> de
                déchets sont produits chaque année, conséquence d'une urbanisation rapide et d'une forte
                croissance démographique.
              </p>
            </div>
            <div className="hud-panel p-8 text-center">
              <p className="hud-meta">Afrique subsaharienne</p>
              <p className="font-display text-5xl text-accent tabular-nums mt-3">174M</p>
              <p className="hud-meta mt-1">tonnes en 2016</p>
              <div className="hud-divider my-6" />
              <p className="font-display text-5xl text-critical tabular-nums">516M</p>
              <p className="hud-meta mt-1">tonnes prévues en 2050</p>
            </div>
          </div>
        </section>

        {/* Protocole */}
        <section aria-labelledby="how" className="border-y border-border bg-surface/40">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <p className="hud-label mb-4">Protocole</p>
            <h2 id="how" className="font-display text-2xl md:text-4xl uppercase mb-10">
              Comment ça marche
            </h2>
            <div className="grid sm:grid-cols-3 gap-px bg-border/60 border border-border/60">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="bg-card p-7">
                    <Icon className="w-7 h-7 text-accent mb-5" />
                    <h3 className="font-display uppercase tracking-wide text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technologie */}
        <section aria-labelledby="tech" className="max-w-6xl mx-auto px-4 py-16">
          <p className="hud-label mb-4">Systèmes</p>
          <h2 id="tech" className="font-display text-2xl md:text-4xl uppercase mb-10">
            Technologie & transparence
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="hud-panel p-7">
              <ShieldCheck className="w-6 h-6 text-accent mb-4" />
              <h3 className="font-display uppercase tracking-wide text-lg mb-3">Blockchain & traçabilité</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Signalements, localisations et points Himpact sont enregistrés de façon traçable pour
                garantir la fiabilité de la donnée civique.
              </p>
            </div>
            <div className="hud-panel p-7">
              <Cpu className="w-6 h-6 text-accent mb-4" />
              <h3 className="font-display uppercase tracking-wide text-lg mb-3">Analyse par IA</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Débora vérifie automatiquement chaque photo, catégorise l'incident et déclenche la
                validation ainsi que l'attribution des points.
              </p>
            </div>
          </div>
        </section>

        {/* Vision */}
        <section aria-labelledby="vision" className="border-t border-border">
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <Users className="w-10 h-10 text-accent mx-auto mb-6" />
            <h2 id="vision" className="font-display text-2xl md:text-4xl uppercase mb-6">Notre vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Optimiser la gestion des cités grâce aux outils technologiques et à la force communautaire,
              tout en évaluant l'impact des actions publiques, privées et citoyennes sur nos zones
              urbaines et périurbaines.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
