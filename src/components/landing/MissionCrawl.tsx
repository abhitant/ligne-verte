import { Circle } from "lucide-react";

const items = [
  { text: "Rends ton quartier zo", color: "text-accent" },
  { text: "Prends tes points", color: "text-alert" },
  { text: "Signale ce qui gâte la cité", color: "text-accent" },
  { text: "WhatsApp + Telegram", color: "text-alert" },
  { text: "Carte publique en temps réel", color: "text-accent" },
  { text: "Validation IA par Débora", color: "text-alert" },
  { text: "Classement des agents terrain", color: "text-accent" },
  { text: "Objectif quartier zo", color: "text-alert" },
];

const MissionCrawl = () => {
  const track = [...items, ...items, ...items];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-surface/40 py-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />
      <div className="animate-crawl flex w-max items-center gap-4">
        {track.map((item, i) => {
          const isAccent = item.color === "text-accent";
          return (
            <div
              key={i}
              className={`flex items-center gap-3 rounded border px-3 py-1.5 ${
                isAccent
                  ? "border-accent/30 bg-accent/10"
                  : "border-alert/30 bg-alert/10"
              }`}
            >
              <Circle className={`h-1.5 w-1.5 fill-current ${item.color}`} />
              <span className={`font-display text-sm font-bold uppercase tracking-widest ${item.color}`}>
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MissionCrawl;
