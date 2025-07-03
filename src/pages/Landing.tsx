
import HeroCarousel from "@/components/landing/HeroCarousel";
import ImpactOverview from "@/components/landing/ImpactOverview";
import MapSection from "@/components/landing/MapSection";
import JoinMovement from "@/components/landing/JoinMovement";
import MarketplacePreview from "@/components/landing/MarketplacePreview";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <HeroCarousel />
      <ImpactOverview />
      <MapSection />
      <JoinMovement />
      <MarketplacePreview />
    </div>
  );
};

export default Landing;
