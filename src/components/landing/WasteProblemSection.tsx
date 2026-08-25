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

const WasteProblemSection = () => {
  return (
    <section id="categories" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="hud-label mb-4">Débora // ce que je peux recevoir</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
            Tout ce qui gâte le <span className="text-accent">quartier</span>,
            <br />
            envoie-le-moi.
          </h2>
          <p className="mt-5 text-lg text-muted-foreground">
            Je ne m'occupe plus seulement des ordures. Si un truc dérange la vie de la cité, ça
            m'intéresse : je le transforme en donnée ouverte, localisée, que la communauté et les
            autorités peuvent utiliser. Toi tu photographies, moi je classe.
          </p>
        </div>

        <DeboraSay
          className="mt-10"
          pose="point"
          line="« Regarde mes six catégories : si ça gâte le quartier, envoie-le-moi, je le range au bon endroit. »"
          cta={{ label: "Les signalements", to: "/signalements" }}
        />



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
