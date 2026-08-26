import HeroSection from "@/components/landing/HeroSection";
import WasteProblemSection from "@/components/landing/WasteProblemSection";
import CivicMapSection from "@/components/landing/CivicMapSection";
import SolutionSection from "@/components/landing/SolutionSection";
import WhyCountsSection from "@/components/landing/WhyCountsSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/landing/Reveal";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <Reveal>
        <WasteProblemSection />
      </Reveal>
      <Reveal>
        <CivicMapSection />
      </Reveal>
      <Reveal>
        <SolutionSection />
      </Reveal>
      <Reveal>
        <WhyCountsSection />
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