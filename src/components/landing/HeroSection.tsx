import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import deboraHero from "@/assets/debora-hero-bust.png";


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
        <div className="grid min-[900px]:grid-cols-12 gap-8 min-[900px]:gap-5 lg:gap-10 items-center">
          {/* Texte à gauche */}
          <div className="min-[900px]:col-span-7 lg:col-span-6 relative z-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="hud-label flex items-center gap-2 border border-accent/40 px-3 py-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Débora est en ligne
              </span>
              <span className="hud-meta">Abidjan · Côte d'Ivoire</span>
            </div>

            <div className="hud-panel relative max-w-2xl px-5 py-6 sm:px-7 sm:py-8 shadow-[0_0_40px_hsl(var(--accent)/0.15)]">
              <p className="hud-label mb-4">Débora // standardiste</p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.05] uppercase">
                Hello, j'ai une mission pour toi.
                <span className="mt-2 block text-accent text-glow">
                  Aide-moi à rendre ton quartier zo.
                </span>
              </h1>
              <div className="absolute top-1/2 -right-2 h-4 w-4 -translate-y-1/2 rotate-45 border-r border-t border-accent/30 bg-card" />
            </div>

            <div className="mt-8 hud-panel px-4 py-3 max-w-xl">
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-accent shrink-0" />
                <span className="hud-meta">Débora reçoit //</span>
                <span className="font-mono text-sm text-foreground truncate">
                  {line}
                  <span className="ml-0.5 text-accent animate-pulse">█</span>
                </span>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lancer une mission avec Débora sur Telegram"
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-display uppercase tracking-widest px-10 py-6 text-base"
                >
                  <Radio className="w-5 h-5 mr-3" />
                  Écris à Débora
                </Button>
              </a>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWaitlistOpen(true)}
                className="w-full sm:w-auto border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground font-display uppercase tracking-widest px-10 py-6 text-base bg-transparent"
              >
                <MessageCircle className="w-5 h-5 mr-3" />
                Rejoindre WhatsApp
              </Button>
            </div>
          </div>

          {/* Pose Hero dédiée : Débora entière, tournée vers le message. */}
          <div className="min-[900px]:col-span-5 lg:col-span-6 relative flex items-end justify-center min-[900px]:justify-end self-stretch min-h-[420px] min-[900px]:min-h-[540px] lg:min-h-[min(660px,calc(100svh-9rem))]">
            <div className="relative w-full h-full max-w-md lg:max-w-xl flex items-end justify-center min-[900px]:justify-end">
              <img
                src={deboraHero}
                alt="Déborah, la standardiste de La Ligne Verte, présente ta mission"
                width={1024}
                height={1536}
                loading="eager"
                className="relative z-10 h-auto w-full max-w-[330px] min-[900px]:max-w-[390px] lg:max-w-[460px] object-contain object-bottom drop-shadow-[0_0_40px_hsl(var(--accent)/0.2)] animate-rise"
              />
            </div>
          </div>
        </div>
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        redirectAfterSubmit
        whatsappUrl={WHATSAPP_INVITE_URL}
      />
    </section>
  );
};

export default HeroSection;
