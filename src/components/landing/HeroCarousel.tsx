
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Info } from "lucide-react";
import { Link } from "react-router-dom";

const HeroCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const fullText = 'Et prend tes points';

  const images = [
    {
      url: "/lovable-uploads/370ea6ab-748e-46d4-8611-0ea0f9a89ce7.png",
      title: "Nettoyage des plages d'Abidjan",
      description: "Ensemble, redonnons vie à nos côtes"
    },
    {
      url: "/lovable-uploads/9d19adf8-f8c6-419c-aab7-ec7dcd24bd5c.png", 
      title: "Collecte des déchets plastiques",
      description: "Chaque geste compte pour notre environnement"
    },
    {
      url: "/lovable-uploads/9c272972-f137-4d9e-839c-412d4d138196.png",
      title: "Citoyens engagés pour un Abidjan propre",
      description: "L'action citoyenne transforme notre ville"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let currentIndex = 0;
    setTypewriterText('');
    
    const typewriterTimer = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypewriterText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typewriterTimer);
      }
    }, 100);

    return () => clearInterval(typewriterTimer);
  }, [currentImage]);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Images Background */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.url}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center text-white px-4 max-w-4xl">
          <div className="mb-12">
            {/* Mobile: Une seule ligne avec tailles différentes */}
            <h1 className="md:hidden text-3xl font-bold mb-4 leading-tight">
              Rend ton quartier <span className="text-green-400 text-4xl">Zo</span>
            </h1>
            
            {/* Desktop: Deux lignes comme avant */}
            <h1 className="hidden md:block text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Rend ton quartier <span className="text-green-400">Zo</span>
            </h1>
            
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-200">
              {typewriterText}<span className="animate-pulse">|</span>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-12">
            <Button size="lg" className="bg-green-400/20 border-2 border-green-400 text-white hover:bg-green-400/30 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl backdrop-blur-md z-20 relative transform hover:scale-105 transition-all">
              <Camera className="w-5 h-5 mr-2" />
              Commencer maintenant
            </Button>
            <Link to="/map">
              <Button variant="outline" size="lg" className="bg-white/10 border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl backdrop-blur-md z-20 relative">
                <Info className="w-5 h-5 mr-2" />
                En apprendre plus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
