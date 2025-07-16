import { Button } from "@/components/ui/button";
import { Camera, Info } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center">
      {/* Fond avec pattern subtil */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/20" />
      
      {/* Content */}
      <div className="relative z-10 text-center text-foreground px-4 max-w-6xl mx-auto">
        <div className="mb-16">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight">
            La Ligne <span className="text-accent">Verte</span>
          </h1>
          
          <p className="text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground mb-12">
            Rend ton quartier <span className="text-accent font-bold">zo</span> et prends tes points.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to="/rejoindre">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-xl font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all">
              <Camera className="w-6 h-6 mr-3" />
              Commencer maintenant
            </Button>
          </Link>
          
          <Link to="/map">
            <Button variant="outline" size="lg" className="border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground px-12 py-6 text-xl font-bold rounded-xl shadow-xl backdrop-blur-sm">
              <Info className="w-6 h-6 mr-3" />
              En apprendre plus
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;