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
    <section id="comment" className="relative bg-background py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
          Comment ça marche ?
          <span className="block text-accent">Quatre étapes, ton quartier devient zo</span>
        </h2>

        <ol className="mt-10 space-y-px border border-border/60 bg-border/60">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.step} className="flex items-start gap-5 bg-card p-5">
                <span className="pt-1 font-mono text-sm text-accent">{s.step}</span>
                <Icon className="mt-0.5 h-6 w-6 shrink-0 text-accent" />
                <div>
                  <h3 className="font-display text-lg uppercase tracking-wide">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" className="mt-10 inline-block">
          <Button size="lg" className="bg-accent px-10 py-6 font-display text-base uppercase tracking-widest text-accent-foreground hover:bg-accent/90">
            <MessageSquare className="mr-3 h-5 w-5" />
            Contacter Débora
          </Button>
        </a>
      </div>
    </section>
  );
};

export default SolutionSection;