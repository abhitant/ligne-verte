
import HeroSection from "@/components/landing/HeroSection";
import WasteProblemSection from "@/components/landing/WasteProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import CommunitySection from "@/components/landing/CommunitySection";
import Footer from "@/components/landing/Footer";

const Landing = () => {
  console.log("Landing component rendered");
  
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WasteProblemSection />
      <SolutionSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Landing;
