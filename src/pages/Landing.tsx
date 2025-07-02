
import HeroCarousel from "@/components/landing/HeroCarousel";
import PollutionDashboard from "@/components/landing/PollutionDashboard";
import ReportsDashboard from "@/components/landing/ReportsDashboard";
import MapSection from "@/components/landing/MapSection";
import JoinMovement from "@/components/landing/JoinMovement";
import MarketplacePreview from "@/components/landing/MarketplacePreview";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <PollutionDashboard />
      <ReportsDashboard />
      <MapSection />
      <JoinMovement />
      <MarketplacePreview />
    </div>
  );
};

export default Landing;
