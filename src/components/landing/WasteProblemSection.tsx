import { Trash2, Lightbulb, Droplets, Construction, Volume2, ShieldAlert } from "lucide-react";
import DeboraSay from "@/components/landing/DeboraSay";
import ReportsCarousel from "@/components/landing/ReportsCarousel";
import TacticalMap from "@/components/landing/TacticalMap";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";



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
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Texte + Débora */}
          <div>
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

          {/* Carrousel des signalements reçus */}
          <ReportsCarousel />
        </div>

        {/* Slides des types de signalement */}
        <div className="mt-16">
          <div className="mb-4 flex items-center justify-between">
            <span className="hud-label">Types de signalement</span>
            <span className="hud-meta hidden sm:inline">06 CATÉGORIES</span>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-px">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <CarouselItem
                    key={cat.code}
                    className="pl-px basis-[85%] sm:basis-1/2 lg:basis-1/3"
                  >
                    <article className="group h-full border border-border/60 bg-card p-7 transition-colors hover:bg-surface">
                      <div className="mb-6 flex items-center justify-between">
                        <Icon className="h-7 w-7 text-accent" />
                        <span className="hud-meta">{cat.code}</span>
                      </div>
                      <h3 className="mb-2 font-display text-xl uppercase tracking-wide transition-colors group-hover:text-accent">
                        {cat.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{cat.desc}</p>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="-left-3 border-accent/50 bg-card text-accent hover:bg-accent hover:text-accent-foreground" />
            <CarouselNext className="-right-3 border-accent/50 bg-card text-accent hover:bg-accent hover:text-accent-foreground" />
          </Carousel>
        </div>

        {/* Carte tactique + informations live */}
        <div className="mt-16">
          <TacticalMap />
        </div>
      </div>
    </section>
  );
};

export default WasteProblemSection;
