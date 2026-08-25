import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import deboraHero from "@/assets/debora-hero-torso.png";


const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    "/lovable-uploads/41b3a1b4-03ed-4912-95dd-05f5880046d0.png",
    "/lovable-uploads/90ed2c8b-791c-42e2-9957-d9b64eea6202.png",
    "/lovable-uploads/d2fefb4c-11b8-457a-a4ac-a09010c75de3.png",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  const scrollToNext = () => {
    document.getElementById("pourquoi")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  return (
    <section id="mission" className="relative min-h-[calc(100svh-4rem)] flex items-center overflow-hidden">
      {/* Fond photo */}
      {images.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt="Opération citoyenne dans la cité"
            className="w-full h-full object-cover grayscale-[35%]"
            loading={index === 0 ? "eager" : "lazy"}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-background/85" />
      <div className="absolute inset-0 hud-grid opacity-60" />
      <div className="absolute inset-0 hud-scanlines opacity-40 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-accent/40 animate-scan-line pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
        <div className="grid min-[900px]:grid-cols-12 gap-6 min-[900px]:gap-4 lg:gap-8 items-center">
          {/* Texte à gauche */}
          <div className="min-[900px]:col-span-6 lg:col-span-6 relative z-20">
            <div className="hud-panel relative max-w-2xl px-5 py-6 sm:px-7 sm:py-8 shadow-[0_0_40px_hsl(var(--accent)/0.15)]">
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] uppercase">
                Hello, j'ai une mission pour toi.
                <span className="mt-2 block text-accent text-glow">
                  Aide-moi à rendre ton quartier zo.
                </span>
              </h1>
              <div className="absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-accent/30 bg-card" />
            </div>

            <div className="mt-10">
              <button
                onClick={scrollToNext}
                className="group relative inline-flex items-center gap-4 overflow-hidden border border-accent/50 bg-accent/10 px-8 py-4 font-display text-sm uppercase tracking-[0.25em] text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_40px_hsl(var(--accent)/0.45)]"
              >
                <span className="absolute inset-y-0 left-0 w-1 bg-accent transition-all duration-300 group-hover:w-full group-hover:opacity-10" />
                <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-accent" />
                <span className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-accent" />
                <span className="relative z-10">En savoir plus</span>
                <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-full border border-current">
                  <ChevronDown className="h-4 w-4 animate-bounce" />
                </span>
              </button>
            </div>
          </div>

          {/* Débora se prolonge sous le Hero : aucune fin d'image visible. */}
          <div className="min-[900px]:col-span-6 lg:col-span-6 relative flex items-end justify-center min-[900px]:justify-end self-stretch min-h-[420px] min-[900px]:min-h-[520px] lg:min-h-[min(680px,calc(100svh-9rem))]">
            <div className="absolute inset-x-0 -bottom-24 min-[900px]:-bottom-40 flex items-end justify-center min-[900px]:justify-end">
              <div className="relative">
                <img
                  src={deboraHero}
                  alt="Débora, la standardiste de La Ligne Verte"
                  width={1024}
                  height={1536}
                  loading="eager"
                  className="relative z-10 h-auto w-full max-w-[390px] min-[900px]:max-w-[500px] lg:max-w-[570px] object-contain object-bottom drop-shadow-[0_0_50px_hsl(var(--accent)/0.22)] animate-rise"
                />
                {/* Badge agent épinglé sur le gilet */}
                <div className="absolute z-20 left-[33%] top-[57%] -rotate-6 w-[26%] min-w-[96px] rounded-sm border border-accent/60 bg-card/95 px-2 py-1.5 shadow-[0_0_24px_hsl(var(--accent)/0.35)] backdrop-blur-sm">
                  <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-accent">La Ligne Verte</p>
                  <p className="font-display text-[10px] sm:text-xs font-bold uppercase leading-tight text-foreground">Débora</p>
                  <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-muted-foreground">Standardiste · ID-001</p>
                  <div className="mt-1 h-0.5 w-full bg-gradient-to-r from-accent via-accent/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
