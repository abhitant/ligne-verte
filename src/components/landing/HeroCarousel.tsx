
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const HeroCarousel = () => {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    {
      url: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=1920&h=1080&fit=crop",
      title: "Zone insalubre à Cocody",
      description: "Des déchets plastiques polluent nos quartiers"
    },
    {
      url: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=1920&h=1080&fit=crop",
      title: "Caniveaux bouchés à Yopougon", 
      description: "Les inondations menacent nos familles"
    },
    {
      url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=1920&h=1080&fit=crop",
      title: "Abidjan peut redevenir verte",
      description: "Ensemble, transformons notre ville"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-8 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-ping"></span>
            URGENCE ÉCOLOGIQUE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Rend ton quartier
            <br />
            <span className="text-yellow-400">ZO</span> et prends tes points
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            {images[currentImage].description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all">
              <Camera className="w-5 h-5 mr-2" />
              Signaler maintenant
            </Button>
            <Link to="/map">
              <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 px-8 py-4 text-lg rounded-xl backdrop-blur-sm">
                <MapPin className="w-5 h-5 mr-2" />
                Voir la carte
              </Button>
            </Link>
          </div>

          {/* Image Indicators */}
          <div className="flex justify-center space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImage ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
