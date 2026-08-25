import { Button } from "@/components/ui/button";
import WaitlistModal from "@/components/WaitlistModal";
import { WHATSAPP_INVITE_URL, TELEGRAM_BOT_URL } from "@/config/links";
import { Radio, MessageCircle, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import deboraPoint from "@/assets/debora-point.png";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [line, setLine] = useState("");
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const images = [
    "/lovable-uploads/41b3a1b4-03ed-4912-95dd-05f5880046d0.png",
    "/lovable-uploads/90ed2c8b-791c-42e2-9957-d9b64eea6202.png",
    "/lovable-uploads/d2fefb4c-11b8-457a-a4ac-a09010c75de3.png",
  ];

  const missions = [
    "dépôt sauvage détecté",
    "lampadaire hors service",
    "caniveau bouché",
    "route dégradée",
    "eau stagnante signalée",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  useEffect(() => {
    let mission = 0;
    let index = 0;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      const target = missions[mission];
      if (index <= target.length) {
        setLine(target.slice(0, index));
        index++;
        timer = setTimeout(type, 60);
      } else {
        timer = setTimeout(() => {
          mission = (mission + 1) % missions.length;
          index = 0;
          type();
        }, 2200);
      }
    };

    type();
    return () => clearTimeout(timer);
  }, []);

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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Texte à gauche */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="hud-label flex items-center gap-2 border border-accent/40 px-3 py-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Débora est en ligne
              </span>
              <span className="hud-meta">Abidjan · Côte d'Ivoire</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] uppercase">
              Aide-moi à rendre
              <span className="block text-accent text-glow">ton quartier zo</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Aide-moi à rendre ton quartier zo et prends tes points. Déchets, éclairage cassé,
              caniveau bouché, route abîmée : tu me l'envoies en photo, je vérifie, je place le point
              sur la carte et je te crédite en points Himpact.
            </p>

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

          {/* La même Débora que dans les autres sections, ancrée à droite et tournée vers le texte. */}
          <div className="lg:col-span-6 xl:col-span-6 relative flex items-end justify-center lg:justify-end self-stretch min-h-[420px] lg:min-h-[min(660px,calc(100svh-9rem))]">
            <div className="relative w-full h-full max-w-md lg:max-w-xl flex items-end justify-end">
              {/* Bulle de dialogue */}
              <div className="absolute top-2 left-0 lg:-left-8 z-20 max-w-[280px] hud-panel p-4 shadow-[0_0_40px_hsl(var(--accent)/0.15)]">
                <p className="hud-label mb-2">Débora // standardiste</p>
                <p className="text-sm text-foreground leading-relaxed">
                  « Hello, moi c'est Déborah et j'ai une mission pour toi. »
                </p>
                <div className="absolute -bottom-2 right-10 w-4 h-4 bg-card border-l border-b border-accent/30 rotate-45" />
              </div>

              <img
                src={deboraPoint}
                alt="Déborah, la standardiste de La Ligne Verte, te donne une mission"
                width={768}
                height={1024}
                loading="eager"
                className="relative z-10 w-auto h-full max-h-[560px] lg:max-h-[min(680px,calc(100svh-9rem))] object-contain object-bottom -scale-x-100 drop-shadow-[0_0_40px_hsl(var(--accent)/0.2)] animate-rise"
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
