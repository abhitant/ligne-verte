import { Trash2, Lightbulb, Droplets, Construction, Volume2, ShieldAlert } from "lucide-react";
import DeboraSay from "@/components/landing/DeboraSay";


const categories = [
  {
    icon: Trash2,
    code: "CAT-01",
    title: "Déchets & dépôts sauvages",
    desc: "Ordures accumulées, décharges improvisées, bacs débordants.",
  },
  {
    icon: Droplets,
    code: "CAT-02",
    title: "Eaux & assainissement",
    desc: "Caniveaux bouchés, eaux stagnantes, fuites et inondations.",
  },
  {
    icon: Lightbulb,
    code: "CAT-03",
    title: "Éclairage public",
    desc: "Lampadaires éteints, zones sombres, câblage exposé.",
  },
  {
    icon: Construction,
    code: "CAT-04",
    title: "Voirie & mobilité",
    desc: "Nids-de-poule, trottoirs occupés, signalisation absente.",
  },
  {
    icon: Volume2,
    code: "CAT-05",
    title: "Nuisances du quartier",
    desc: "Bruit, fumées, odeurs, occupation abusive de l'espace public.",
  },
  {
    icon: ShieldAlert,
    code: "CAT-06",
    title: "Tout autre désagrément",
    desc: "Si ça gêne la vie de la cité, ça mérite un signalement.",
  },
];

const challengePhotos = [
  "/lovable-uploads/41b3a1b4-03ed-4912-95dd-05f5880046d0.png",
  "/lovable-uploads/90ed2c8b-791c-42e2-9957-d9b64eea6202.png",
  "/lovable-uploads/d2fefb4c-11b8-457a-a4ac-a09010c75de3.png",
];

const WasteProblemSection = () => {
  return (
    <section id="categories" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Photos de défi */}
          <div className="hud-panel p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="hud-label">Débora // défis reçus</span>
              <span className="hud-meta">GALERIE</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {challengePhotos.map((photo, index) => (
                <div key={photo} className="relative aspect-square overflow-hidden border border-border/70 bg-surface/60 group">
                  <img
                    src={photo}
                    alt={`Défi citoyen ${index + 1}`}
                    className="w-full h-full object-cover grayscale-[25%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-2 left-2 font-mono text-[10px] uppercase tracking-wider text-accent bg-card/80 px-1.5 py-0.5 border border-accent/30">
                    DEF-{String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted-foreground italic">
              « Tout ce qui gâte le quartier, envoie-le-moi. Je le transforme en donnée ouverte et localisée. »
            </p>
          </div>

          {/* Texte + catégories */}
          <div>
            <p className="hud-label mb-4">Débora // ce que je peux recevoir</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              Tout ce qui gâte le <span className="text-accent">quartier</span>,
              <br />
              envoie-le-moi.
            </h2>

            <DeboraSay
              className="mt-8"
              pose="point"
              line="« Regarde mes six catégories : si ça gâte le quartier, envoie-le-moi, je le range au bon endroit. »"
              cta={{ label: "Les signalements", to: "/signalements" }}
            />
          </div>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <article
                key={cat.code}
                className="group bg-card p-7 transition-colors hover:bg-surface"
              >
                <div className="flex items-center justify-between mb-6">
                  <Icon className="w-7 h-7 text-accent" />
                  <span className="hud-meta">{cat.code}</span>
                </div>
                <h3 className="font-display text-xl uppercase tracking-wide mb-2 group-hover:text-accent transition-colors">
                  {cat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WasteProblemSection;