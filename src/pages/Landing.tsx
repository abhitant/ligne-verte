import HeroSection from "@/components/landing/HeroSection";
import OpsStatsBand from "@/components/landing/OpsStatsBand";
import WhySection from "@/components/landing/WhySection";
import WasteProblemSection from "@/components/landing/WasteProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";
import DeboraGuide from "@/components/landing/DeboraGuide";
import { TELEGRAM_BOT_URL } from "@/config/links";

const stops = [
  {
    id: "mission",
    pose: "wave" as const,
    line: "« Monsieur Prime, c'est moi la standardiste. Toi tu es mon agent terrain : aide-moi à rendre ton quartier zo. »",
    cta: { label: "Écris-moi", to: TELEGRAM_BOT_URL, external: true },
  },
  {
    id: "pourquoi",
    pose: "point" as const,
    line: "« Voilà pourquoi c'est important : ce qu'on ne voit pas, personne ne le règle. Ta photo rend le problème visible. »",
    cta: { label: "Voir la carte", to: "/carte" },
  },
  {
    id: "categories",
    pose: "point" as const,
    line: "« Tout ce qui gâte la cité m'intéresse : ordures, caniveau, lampadaire, route… envoie, je classe. »",
    cta: { label: "Les signalements", to: "/signalements" },
  },
  {
    id: "comment",
    pose: "wave" as const,
    line: "« Comment me contacter ? WhatsApp ou Telegram, une photo, et c'est bon. Quatre étapes, puis tu prends tes points. »",
    cta: { label: "Me contacter", to: TELEGRAM_BOT_URL, external: true },
  },
  {
    id: "carte-live",
    pose: "point" as const,
    line: "« Regarde le classement : les meilleurs agents terrain montent chaque semaine. Tu peux y être. »",
    cta: { label: "Le classement", to: "/classement" },
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <OpsStatsBand />
      <WhySection />
      <WasteProblemSection />
      <SolutionSection />
      <CommunitySection />
      <Footer />
      <DeboraGuide stops={stops} />
    </div>
  );
};

export default Landing;
