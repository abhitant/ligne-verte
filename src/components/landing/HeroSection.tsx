import { Button } from "@/components/ui/button";
import WaitlistModal from "@/components/WaitlistModal";
import { WHATSAPP_INVITE_URL, TELEGRAM_BOT_URL } from "@/config/links";
import { Radio, MessageCircle, MapPin, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <section className="relative min-h-screen flex items-center overflow-hidden">
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="hud-label flex items-center gap-2 border border-accent/40 px-3 py-1">
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Débora est en ligne
              </span>
              <span className="hud-meta">Abidjan · Côte d'Ivoire</span>
            </div>

            <p className="font-mono text-sm md:text-base text-accent mb-5">
              « Hello mon ! C'est Débora, j'ai une mission pour toi… »
            </p>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] uppercase">
              Rends ton quartier
              <span className="block text-accent text-glow">zo, prends tes points</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
              Aide-moi à garder la cité propre et vivable. Déchets, éclairage cassé, caniveau
              bouché, route abîmée&nbsp;: tu me l'envoies en photo, je m'occupe du reste et je te
              paie en points Himpact. C'est moi ta standardiste, tu es mon agent sur le terrain.
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
              <a href={TELEGRAM_BOT_URL} target="_blank" rel="noopener noreferrer" aria-label="Lancer une mission avec Débora sur Telegram">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-display uppercase tracking-widest px-10 py-6 text-base">
                  <Radio className="w-5 h-5 mr-3" />
                  Lancer une mission
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

          {/* Panneau statut */}
          <div className="lg:col-span-4">
            <div className="hud-panel p-5 space-y-5">
              <div className="flex items-center justify-between">
                <span className="hud-label">Unité 001 · Débora</span>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              </div>
              <div className="hud-divider" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Agent d'accueil de la Ligne Verte. Elle reçoit ta photo, vérifie l'incident par IA,
                le place sur la carte et te crédite en points Himpact.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-border/70 p-3">
                  <p className="hud-meta">Canaux</p>
                  <p className="font-display text-lg">WhatsApp · Telegram</p>
                </div>
                <div className="border border-border/70 p-3">
                  <p className="hud-meta">Délai analyse</p>
                  <p className="font-display text-lg text-accent">&lt; 60 s</p>
                </div>
              </div>
              <Link to="/carte" className="block">
                <Button variant="ghost" className="w-full justify-between font-mono text-xs uppercase tracking-[0.2em] text-accent hover:bg-accent/10">
                  Ouvrir la carte tactique
                  <MapPin className="w-4 h-4" />
                </Button>
              </Link>
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
