import HeroSection from "@/components/landing/HeroSection";
import WasteProblemSection from "@/components/landing/WasteProblemSection";
import CivicMapSection from "@/components/landing/CivicMapSection";
import SolutionSection from "@/components/landing/SolutionSection";
import WhyCountsSection from "@/components/landing/WhyCountsSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/landing/Reveal";
import ScrollCue from "@/components/landing/ScrollCue";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Reveal>
        <WasteProblemSection />
      </Reveal>
      <ScrollCue targetId="carte-live" label="La carte" />
      <CivicMapSection />
      <ScrollCue targetId="comment" label="Comment ça marche" />
      <Reveal>
        <SolutionSection />
      </Reveal>
      <ScrollCue targetId="pourquoi" label="Pourquoi ça compte" />
      <Reveal>
        <WhyCountsSection />
      </Reveal>
      <ScrollCue targetId="reconnaissance" label="Reconnaissance" />
      <Reveal>
        <CommunitySection />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </div>
  );
};

export default Landing;
