import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Lightbulb, Droplets, Construction, Volume2, ShieldAlert, Swords } from "lucide-react";
import deboraMapFull from "@/assets/debora-map-full.png";

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

/** Encadré d'instruction style jeu vidéo, superposé à la carte. */
const DeboraTypesTicker = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % reportTypes.length), 4000);
    return () => clearInterval(id);
  }, []);

  const item = reportTypes[i];
  const Icon = item.icon;

  return (
    <div className="flex items-end gap-0">
      <img
        src={deboraMapFull}
        alt="Déborah présente les types de signalements"
        width={1024}
        height={1024}
        loading="lazy"
        className="pointer-events-none -mr-6 h-auto w-20 shrink-0 object-contain drop-shadow-2xl sm:-mr-12 sm:w-44 lg:w-56"
      />
      <div className="pointer-events-auto w-[15rem] border-2 border-accent/70 bg-card/95 p-3 shadow-[0_0_0_1px_hsl(var(--background)),0_16px_40px_-16px_hsl(0_0%_0%_/_0.9)] backdrop-blur-sm sm:w-[22rem] sm:p-4">

        <div className="mb-2 flex items-center justify-between gap-2">
          <Icon className="h-4 w-4 text-accent" />
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

        <Link
          to="/defis"
          className="mt-3 flex items-center justify-between gap-2 border border-accent/60 bg-accent/10 px-2.5 py-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-accent transition-colors hover:bg-accent hover:text-accent-foreground sm:text-[0.65rem]"
        >
          <span className="flex items-center gap-1.5">
            <Swords className="h-3.5 w-3.5" />
            Participer à un défi
          </span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
};


export default DeboraTypesTicker;
