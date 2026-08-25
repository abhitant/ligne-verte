import HeroSection from "@/components/landing/HeroSection";
import OpsStatsBand from "@/components/landing/OpsStatsBand";
import WhySection from "@/components/landing/WhySection";
import WasteProblemSection from "@/components/landing/WasteProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/landing/Reveal";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Reveal>
        <OpsStatsBand />
      </Reveal>
      <Reveal>
        <WhySection />
      </Reveal>
      <Reveal>
        <WasteProblemSection />
      </Reveal>
      <Reveal>
        <SolutionSection />
      </Reveal>
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
