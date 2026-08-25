import HeroSection from "@/components/landing/HeroSection";
import OpsStatsBand from "@/components/landing/OpsStatsBand";
import WhySection from "@/components/landing/WhySection";
import WasteProblemSection from "@/components/landing/WasteProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";

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
    </div>
  );
};

export default Landing;
