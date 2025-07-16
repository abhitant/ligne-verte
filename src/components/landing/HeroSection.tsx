import { Button } from "@/components/ui/button";
import { Camera, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [firstLineText, setFirstLineText] = useState("");
  const [secondLineText, setSecondLineText] = useState("");
  
  const images = [
    "/lovable-uploads/41b3a1b4-03ed-4912-95dd-05f5880046d0.png",
    "/lovable-uploads/90ed2c8b-791c-42e2-9957-d9b64eea6202.png",
    "/lovable-uploads/d2fefb4c-11b8-457a-a4ac-a09010c75de3.png"
  ];

  const firstLine = "Rend ton quartier zo";
  const secondLine = "Prend tes points";

  // Carrousel d'images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [images.length]);

  // Effet typewriter séquentiel
  useEffect(() => {
    let phase = 0; // 0: première ligne, 1: deuxième ligne, 2: pause
    let index = 0;
    let timer: NodeJS.Timeout;
    
    const type = () => {
      if (phase === 0) {
        // Première ligne
        if (index <= firstLine.length) {
          setFirstLineText(firstLine.slice(0, index));
          index++;
          timer = setTimeout(type, 100);
        } else {
          // Passer à la deuxième ligne
          phase = 1;
          index = 0;
          timer = setTimeout(type, 200);
        }
      } else if (phase === 1) {
        // Deuxième ligne
        if (index <= secondLine.length) {
          setSecondLineText(secondLine.slice(0, index));
          index++;
          timer = setTimeout(type, 100);
        } else {
          // Pause puis recommencer
          phase = 2;
          timer = setTimeout(() => {
            setFirstLineText("");
            setSecondLineText("");
            phase = 0;
            index = 0;
            type();
          }, 3000);
        }
      }
    };
    
    type();
    
    return () => clearTimeout(timer);
  }, [firstLine, secondLine]);

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
          <div className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed space-y-2 min-h-[8rem] flex flex-col items-center justify-center">
            <div className="font-bold tracking-wide">
              {renderText(firstLineText)}
              {firstLineText && <span className="animate-pulse ml-1 text-white">|</span>}
            </div>
            <div className="font-bold tracking-wide">
              {renderText(secondLineText)}
              {secondLineText && !firstLineText.includes(firstLine) && <span className="animate-pulse ml-1 text-white">|</span>}
            </div>
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