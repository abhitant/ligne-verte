import { ChevronDown, CheckCircle2, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useReports } from "@/hooks/useReports";
import { useLeaderboard } from "@/hooks/useGamification";
import deboraHero from "@/assets/debora-hero-torso.png";


const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const { data: reports = [] } = useReports();
  const { data: operators = [] } = useLeaderboard(100);

  const validated = reports.filter((r) => r.status === "validated").length;
  const pending = reports.filter((r) => r.status === "pending").length;

  const stats = [
    { icon: CheckCircle2, label: "Missions validées", value: validated },
    { icon: Clock, label: "En cours de vérification", value: pending },
    { icon: Users, label: "Agents sur le terrain", value: operators.length },
  ];

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
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  return (
    <section id="mission" className="relative h-[calc(100svh-4rem)] min-h-[560px] flex items-center overflow-hidden">
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
            <div className="absolute inset-x-0 -bottom-16 min-[900px]:-bottom-28 flex items-end justify-center min-[900px]:justify-end">
              <div className="relative">
                <img
                  src={deboraHero}
                  alt="Débora, la standardiste de La Ligne Verte"
                  width={1024}
                  height={1536}
                  loading="eager"
                  className="relative z-10 h-auto w-full max-w-[390px] min-[900px]:max-w-[500px] lg:max-w-[570px] object-contain object-bottom drop-shadow-[0_0_50px_hsl(var(--accent)/0.22)] animate-rise"
                />
                {/* Badge LIGNE VERTE en haut à droite de la tête */}
                <div className="absolute z-20 right-0 top-[14%] translate-x-1/4 w-[28%] min-w-[104px] overflow-hidden rounded border border-accent/50 bg-card/95 shadow-[0_0_30px_hsl(var(--accent)/0.35)] backdrop-blur-sm">
                  {/* Lanyard droit */}
                  <div className="absolute -bottom-5 left-1/2 h-5 w-0.5 -translate-x-1/2 bg-accent/70" />
                  <div className="absolute -bottom-6 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-accent/70 bg-card" />
                  {/* Header */}
                  <div className="flex items-center justify-between bg-accent/10 px-2 py-1">
                    <p className="font-mono text-[6px] sm:text-[7px] uppercase tracking-[0.15em] text-accent">Ligne Verte</p>
                    <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                  </div>
                  {/* Body */}
                  <div className="px-2 py-1.5">
                    <p className="font-display text-[11px] sm:text-xs font-bold uppercase leading-tight text-foreground">Débora</p>
                    <p className="mt-0.5 font-mono text-[7px] sm:text-[8px] uppercase tracking-widest text-muted-foreground">Standardiste</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded-sm bg-accent/20 flex items-center justify-center">
                        <span className="font-mono text-[6px] text-accent">#</span>
                      </div>
                      <p className="font-mono text-[9px] sm:text-[10px] font-bold tracking-wider text-accent">habitant#00X</p>
                    </div>
                  </div>
                  {/* Footer bar */}
                  <div className="h-0.5 w-full bg-gradient-to-r from-accent via-accent/40 to-transparent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats alignées en bas du Hero */}
      <div className="absolute inset-x-0 bottom-0 z-30 border-t border-border/70 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-border/70">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="p-4 sm:p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="hud-meta hidden sm:inline">{s.label}</span>
                  </div>
                  <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-foreground tabular-nums">
                    {String(s.value).padStart(2, "0")}
                  </p>
                  <p className="hud-meta sm:hidden mt-1">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;