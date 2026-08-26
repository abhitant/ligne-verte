import { ChevronDown, MessageCircle, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TELEGRAM_BOT_URL, WHATSAPP_INVITE_URL } from "@/config/links";
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
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };


  return (
    <section id="mission" className="relative min-h-[calc(100svh-4rem)] flex items-start min-[900px]:items-center min-[900px]:h-[calc(100svh-4rem)] overflow-hidden">
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0 min-[900px]:py-10 lg:py-16">
        <div className="grid min-[900px]:grid-cols-12 gap-4 min-[900px]:gap-4 lg:gap-8 items-center">

          {/* Texte à gauche */}
          <div className="min-[900px]:col-span-6 lg:col-span-6 relative z-20">
            <div className="hud-panel relative max-w-2xl px-4 py-5 sm:px-7 sm:py-8 shadow-[0_0_40px_hsl(var(--accent)/0.15)]">
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold leading-[1.08] uppercase">
                Hello, j'ai une mission pour toi.
                <span className="mt-2 block text-accent text-glow">
                  Aide-moi à rendre ton quartier zo.
                </span>
              </h1>
              <div className="hidden min-[900px]:block absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-accent/30 bg-card" />
            </div>

            <div className="mt-5 min-[900px]:mt-10 grid max-w-2xl grid-cols-1 sm:grid-cols-2 gap-3">

              <button
                onClick={scrollToNext}
                className="group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden border border-accent/50 bg-accent/10 px-4 font-display text-xs sm:text-sm uppercase tracking-[0.18em] text-accent transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_40px_hsl(var(--accent)/0.45)]"
              >
                <span className="absolute inset-y-0 left-0 w-1 bg-accent transition-all duration-300 group-hover:w-full group-hover:opacity-10" />
                <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-accent" />
                <span className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-accent" />
                <span className="relative z-10">En savoir plus</span>
                <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-current">
                  <ChevronDown className="h-3.5 w-3.5 animate-bounce" />
                </span>
              </button>

              <Popover>
                <PopoverTrigger asChild>
                  <button className="group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden border border-accent/50 bg-card px-4 font-display text-xs sm:text-sm uppercase tracking-[0.18em] text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_40px_hsl(var(--accent)/0.45)]">
                    <span className="absolute inset-y-0 left-0 w-1 bg-accent transition-all duration-300 group-hover:w-full group-hover:opacity-10" />
                    <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-accent" />
                    <span className="absolute right-0 bottom-0 h-2 w-2 border-r border-b border-accent" />
                    <span className="relative z-10">Me contacter</span>
                    <span className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-current">
                      <MessageCircle className="h-3.5 w-3.5" />
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 border-accent/30 bg-card/95 backdrop-blur-md p-0">
                  <div className="p-1">
                    <a
                      href={WHATSAPP_INVITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded px-3 py-3 text-sm font-mono uppercase tracking-widest text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    >
                      <MessageCircle className="h-4 w-4 text-accent" />
                      WhatsApp
                    </a>
                    <a
                      href={TELEGRAM_BOT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded px-3 py-3 text-sm font-mono uppercase tracking-widest text-foreground transition-colors hover:bg-accent/10 hover:text-accent"
                    >
                      <MessageSquare className="h-4 w-4 text-accent" />
                      Telegram
                    </a>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Déborah se prolonge sous le Hero : aucune fin d'image visible. */}
          <div className="min-[900px]:col-span-6 lg:col-span-6 relative flex items-end justify-center min-[900px]:justify-end self-stretch min-[900px]:min-h-[520px] lg:min-h-[min(680px,calc(100svh-9rem))]">
            <div className="relative w-full flex items-end justify-center min-[900px]:absolute min-[900px]:inset-x-0 min-[900px]:-bottom-28 min-[900px]:justify-end">
              <div className="relative">
                <img
                  src={deboraHero}
                  alt="Déborah, la standardiste de La Ligne Verte"
                  width={1024}
                  height={1536}
                  loading="eager"
                  className="relative z-10 h-auto w-full max-w-[210px] sm:max-w-[280px] min-[900px]:max-w-[500px] lg:max-w-[570px] object-contain object-bottom drop-shadow-[0_0_50px_hsl(var(--accent)/0.22)] animate-rise"
                />

                {/* Connector line from badge to Déborah's face */}
                <svg
                  className="pointer-events-none absolute inset-0 z-30 hidden min-[900px]:block overflow-visible"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <filter id="connector-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="1.2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  {/* Petite flèche autonome : elle indique Déborah sans atteindre son visage. */}
                  <path
                    d="M 76 18.5 L 68 18.5"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="0.55"
                    filter="url(#connector-glow)"
                    opacity="0.9"
                  />
                  {/* Pointe arrêtée à bonne distance du visage. */}
                  <polygon
                    points="67,18.5 69.2,17.2 69.2,19.8"
                    fill="hsl(var(--accent))"
                    filter="url(#connector-glow)"
                  />
                  <circle cx="76" cy="18.5" r="0.65" fill="hsl(var(--accent))" />
                </svg>

                {/* Badge LIGNE VERTE en haut à droite de la tête */}
                <div className="absolute z-20 right-0 top-[10%] translate-x-2 min-[900px]:translate-x-1/4 w-[42%] min-w-[84px] min-[900px]:w-[28%] min-[900px]:min-w-[104px] overflow-hidden rounded border border-accent/50 bg-card/95 shadow-[0_0_30px_hsl(var(--accent)/0.35)] backdrop-blur-sm">

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
                    <p className="font-display text-[11px] sm:text-xs font-bold uppercase leading-tight text-foreground">Déborah</p>
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
    </section>
  );
};

export default HeroSection;
