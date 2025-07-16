import { Button } from "@/components/ui/button";
import { Camera, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  
  const images = [
    "/lovable-uploads/41b3a1b4-03ed-4912-95dd-05f5880046d0.png",
    "/lovable-uploads/90ed2c8b-791c-42e2-9957-d9b64eea6202.png",
    "/lovable-uploads/d2fefb4c-11b8-457a-a4ac-a09010c75de3.png"
  ];

  const fullText = "Rend ton quartier zo et prends tes points.";

  // Carrousel d'images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Effet typewriter en continu
  useEffect(() => {
    let index = 0;
    let isTyping = true;
    let pauseTimer: NodeJS.Timeout;

    const typewriterLoop = () => {
      const timer = setInterval(() => {
        if (isTyping && index <= fullText.length) {
          setTypewriterText(fullText.slice(0, index));
          index++;
          
          if (index > fullText.length) {
            clearInterval(timer);
            // Pause de 3 secondes avant de recommencer
            pauseTimer = setTimeout(() => {
              index = 0;
              typewriterLoop();
            }, 3000);
          }
        }
      }, 100);
      
      return timer;
    };

    const initialTimer = typewriterLoop();

    return () => {
      clearInterval(initialTimer);
      clearTimeout(pauseTimer);
    };
  }, []);

  // Fonction pour formater le texte avec "zo" en vert
  const renderText = (text: string) => {
    const parts = text.split(/(zo)/);
    return parts.map((part, index) => (
      <span key={index} className={part === 'zo' ? 'text-accent' : 'text-white'}>
        {part}
      </span>
    ));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Images en arrière-plan */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={image}
            alt={`Action environnementale ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
      ))}
      
      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="mb-16">
          <div className="text-2xl md:text-3xl lg:text-4xl font-medium mb-12 min-h-[3rem] flex items-center justify-center leading-relaxed">
            <span className="font-bold tracking-wide">
              {renderText(typewriterText)}
            </span>
            <span className="animate-pulse ml-1 text-white">|</span>
          </div>
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