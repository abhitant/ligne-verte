import { Button } from "@/components/ui/button";
import { Camera, MapPin, Trophy, MessageSquare } from "lucide-react";
import { TELEGRAM_BOT_URL } from "@/config/links";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Prends la photo",
    desc: "« Montre-moi le problème, où qu'il soit dans ton quartier. »",
  },
  {
    icon: MessageSquare,
    step: "02",
    title: "Envoie-la-moi",
    desc: "« Sur WhatsApp ou Telegram. Je vérifie avec mon IA en moins d'une minute. »",
  },
  {
    icon: MapPin,
    step: "03",
    title: "Je place le point",
    desc: "« Ton signalement apparaît sur la carte publique, visible par tout le monde. »",
  },
  {
    icon: Trophy,
    step: "04",
    title: "Prends tes points",
    desc: "« Chaque mission validée te rapporte des Himpact et te fait monter au classement. »",
  },
];


const SolutionSection = () => {
  return (
    <section id="comment" className="relative py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Débora — fiche personnage */}
          <div className="hud-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="hud-label">Fiche agent // Débora</span>
              <span className="hud-meta">NIV. ∞</span>
            </div>
            <div className="relative overflow-hidden border border-border/70">
              <img
                src="/lovable-uploads/79ecd174-464d-4573-a561-22942396adf3.png"
                alt="Débora, agent d'accueil de La Ligne Verte"
                className="w-full h-auto"
                loading="lazy"
              />
              <div className="absolute inset-0 hud-scanlines opacity-30 pointer-events-none" />
            </div>
            <p className="mt-5 text-muted-foreground italic leading-relaxed">
              « Hello mon, c'est moi Débora, la standardiste de la Ligne Verte. J'ai une mission
              pour toi : aide-moi à rendre ton quartier zo. Envoie-moi ce qui ne va pas, je
              m'occupe du reste et je te paie en Himpact. »
            </p>

            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { k: "Analyse IA", v: "Auto" },
                { k: "Canaux", v: "WA · TG" },
                { k: "Zone", v: "Abidjan" },
              ].map((s) => (
                <div key={s.k} className="border border-border/70 p-3 text-center">
                  <p className="hud-meta">{s.k}</p>
                  <p className="font-display text-accent">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Déroulé mission */}
          <div>
            <p className="hud-label mb-4">Débora // ta mission</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight mb-10">
              Quatre étapes,
              <span className="block text-accent">et ton quartier devient zo</span>
            </h2>


            <ol className="space-y-px bg-border/60 border border-border/60">
              {steps.map((s) => {
                const Icon = s.icon;
                return (
                  <li key={s.step} className="flex items-start gap-5 bg-card p-5">
                    <span className="font-mono text-accent text-sm pt-1">{s.step}</span>
                    <Icon className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-display uppercase tracking-wide text-lg">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="inline-block mt-10">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-display uppercase tracking-widest px-10 py-6 text-base">
                <MessageSquare className="w-5 h-5 mr-3" />
                Contacter Débora
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
