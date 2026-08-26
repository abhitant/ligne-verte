import { useEffect, useState } from "react";
import { Trash2, Lightbulb, Droplets, Construction, Volume2, ShieldAlert } from "lucide-react";
import deboraWave from "@/assets/debora-wave.png";

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
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
      <div className="relative shrink-0">
        <div className="absolute -inset-4 rounded-full bg-accent/10 blur-2xl" />
        <img
          src={deboraWave}
          alt="Débora présente les types de signalement"
          width={768}
          height={1024}
          loading="lazy"
          className="relative h-auto w-24 rotate-[-2deg] object-contain sm:w-32 lg:w-40"
        />
      </div>

      <div className="hud-panel relative w-full flex-1 overflow-hidden p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="hud-label flex items-center gap-2">
            <Icon className="h-4 w-4 text-accent" />
            Ce que je reçois
          </span>
          <span className="hud-meta">{item.code} / 06</span>
        </div>

        <div key={item.code} className="animate-in fade-in duration-500">
          <h3 className="font-display text-lg uppercase tracking-wide text-accent sm:text-xl">
            {item.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{item.line}</p>
        </div>

        <div className="mt-4 flex items-center gap-1.5">
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
