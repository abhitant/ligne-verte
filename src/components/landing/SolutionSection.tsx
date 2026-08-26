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
    <section id="comment" className="relative overflow-hidden bg-background py-24">
      {/* Grille tactique de fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              Comment ça marche ?
              <span className="block text-accent">Ton quartier devient zo</span>
            </h2>
          </div>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <li
                key={s.step}
                className="group relative flex flex-col overflow-hidden border border-border/70 bg-card/70 p-5 backdrop-blur-sm transition-colors hover:border-accent/70"
              >
                {/* coins HUD */}
                <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-accent/70" />
                <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-accent/70" />

                <span className="pointer-events-none absolute -right-2 -top-4 font-display text-6xl font-bold text-accent/10 transition-colors group-hover:text-accent/20">
                  {s.step}
                </span>

                <div className="mb-4 flex h-11 w-11 items-center justify-center border border-accent/40 bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>

                <h3 className="font-display text-base uppercase leading-tight tracking-wide">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>

                <span className="mt-5 block h-px w-full bg-border">
                  <span
                    className="block h-px bg-accent transition-all duration-500"
                    style={{ width: `${((idx + 1) / steps.length) * 100}%` }}
                  />
                </span>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 flex justify-center">
          <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <Button size="lg" className="bg-accent px-8 font-display uppercase tracking-widest text-accent-foreground hover:bg-accent/90">
              <MessageSquare className="mr-3 h-5 w-5" />
              Me contacter
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
