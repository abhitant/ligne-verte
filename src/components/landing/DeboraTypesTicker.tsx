import { useEffect, useState } from "react";
import { Trash2, Lightbulb, Droplets, Construction, Volume2, ShieldAlert } from "lucide-react";

export const reportTypes = [
  {
    icon: Trash2,
    code: "CAT-01",
    title: "Déchets & dépôts sauvages",
    line: "« Ordures accumulées, décharge improvisée, bac qui déborde ? Prends la photo, je m'occupe du reste. »",
  },
  {
    icon: Droplets,
    code: "CAT-02",
    title: "Eaux & assainissement",
    line: "« Caniveau bouché, eau stagnante, fuite ou inondation — envoie-moi ça avant que ça tourne mal. »",
  },
  {
    icon: Lightbulb,
    code: "CAT-03",
    title: "Éclairage public",
    line: "« Lampadaire éteint, zone sombre, câble à nu : la nuit aussi, le quartier doit être sûr. »",
  },
  {
    icon: Construction,
    code: "CAT-04",
    title: "Voirie & mobilité",
    line: "« Nid-de-poule, trottoir occupé, panneau disparu ? Ça se signale aussi, hein. »",
  },
  {
    icon: Volume2,
    code: "CAT-05",
    title: "Nuisances du quartier",
    line: "« Bruit, fumée, odeurs, occupation abusive de l'espace public : tout ça compte. »",
  },
  {
    icon: ShieldAlert,
    code: "CAT-06",
    title: "Tout autre désagrément",
    line: "« Si ça gâte la vie de la cité, envoie-le-moi. Je trie, je vérifie, je place le point. »",
  },
];

/** Débora au-dessus de la carte : son encadré défile pour expliquer les types de signalement. */
const DeboraTypesTicker = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % reportTypes.length), 4000);
    return () => clearInterval(id);
  }, []);

  const item = reportTypes[i];
  const Icon = item.icon;

  return (
    <div className="pointer-events-auto flex items-end gap-0">
      {/* Personnage superposé à la carte */}
      <div className="relative shrink-0 -mr-2 sm:-mr-3">
        <div className="absolute inset-x-2 bottom-0 h-6 rounded-[50%] bg-accent/25 blur-md" />
        <img
          src={deboraWave}
          alt="Débora t'explique les signalements"
          width={768}
          height={1024}
          loading="lazy"
          className="relative h-auto w-20 origin-bottom object-contain drop-shadow-[0_10px_24px_hsl(0_0%_0%_/_0.7)] sm:w-28 lg:w-32"
        />
      </div>

      {/* Boîte d'instruction style jeu vidéo */}
      <div className="relative mb-2 w-[15rem] border-2 border-accent/70 bg-card/95 p-3 shadow-[0_0_0_1px_hsl(var(--background)),0_16px_40px_-16px_hsl(0_0%_0%_/_0.9)] backdrop-blur-sm sm:w-[20rem] sm:p-4">
        {/* Petite flèche vers le personnage */}
        <span className="absolute -left-[9px] bottom-6 h-3 w-3 rotate-45 border-b-2 border-l-2 border-accent/70 bg-card" />

        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="hud-label flex items-center gap-1.5 text-[0.6rem]">
            <Icon className="h-3.5 w-3.5 text-accent" />
            Débora
          </span>
          <span className="hud-meta text-[0.6rem]">{item.code} / 06</span>
        </div>

        <div key={item.code} className="animate-in fade-in slide-in-from-bottom-1 duration-500">
          <h3 className="font-display text-sm uppercase leading-tight tracking-wide text-accent sm:text-base">
            {item.title}
          </h3>
          <p className="mt-1 text-[0.72rem] leading-snug text-foreground sm:text-xs">{item.line}</p>
        </div>

        <div className="mt-3 flex items-center gap-1">
          {reportTypes.map((t, idx) => (
            <button
              key={t.code}
              type="button"
              aria-label={t.title}
              onClick={() => setI(idx)}
              className={`h-1 flex-1 transition-colors ${idx === i ? "bg-accent" : "bg-border"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeboraTypesTicker;
