import { Card, CardContent } from "@/components/ui/card";
import { Trash2, MapPin, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import ligneVerteLogo from "@/assets/ligne-verte-logo.png";

const WasteProblemSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    {
      src: "/lovable-uploads/41170097-be04-4adf-98c3-0ba26b5efd3a.png",
      alt: "Collecte de déchets avec seau bleu"
    },
    {
      src: "/lovable-uploads/c3dd5fe0-b292-40f6-8bf8-5d335dafa57a.png", 
      alt: "Personne en tenue verte faisant du nettoyage"
    }
  ];

  useEffect(() => {
    // Animation séquentielle des cartes
    const timers = [
      setTimeout(() => setVisibleCards(prev => [...prev, 0]), 500),
      setTimeout(() => setVisibleCards(prev => [...prev, 1]), 1000),
      setTimeout(() => setVisibleCards(prev => [...prev, 2]), 1500),
    ];

    // Animation séquentielle des images - changement d'image
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3000);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearInterval(imageInterval);
    };
  }, [images.length]);

  const stats = [
    {
      icon: Trash2,
      number: "4 000 000",
      label: "tonnes de déchets/an",
      sublabel: "Côte d'Ivoire",
      color: "text-accent"
    },
    {
      icon: MapPin,
      number: "2 000 000",
      label: "tonnes",
      sublabel: "Ville d'Abidjan",
      color: "text-accent"
    },
    {
      icon: TrendingDown,
      number: "50%",
      label: "finissent dans les rues",
      sublabel: "Déchets non traités",
      color: "text-red-500"
    }
  ];

  return (
    <div className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header centré */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
            Les déchets urbains dégradent nos villes et quartiers
          </h2>
        </div>

        {/* Graphiques en dessous */}
        <div className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card 
                  key={index}
                  className={`bg-primary border-primary/20 transition-all duration-700 transform ${
                    visibleCards.includes(index) 
                      ? 'translate-x-0 opacity-100' 
                      : 'translate-x-8 opacity-0'
                  }`}
                >
                  <CardContent className="p-6 flex items-center space-x-4">
                    <Icon className={`w-12 h-12 ${stat.color}`} />
                    <div className="flex-1">
                      <div className={`text-3xl font-bold ${stat.color}`}>
                        {stat.number}
                      </div>
                      <div className="text-white font-medium">
                        {stat.label}
                      </div>
                      <div className="text-white/70 text-sm">
                        {stat.sublabel}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>


        {/* Section texte solution avec images */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-16">
          <div className="text-left">
            <h2 className="text-2xl md:text-3xl font-bold leading-none text-foreground mb-4">
              Notre solution contre les déchets urbain : <span className="text-accent">La ligne verte</span>
            </h2>
            <p className="text-lg text-foreground leading-relaxed text-justify">
              La ligne verte est une plateforme participative mise en place par Greenpill civ, pour signaler les déchets urbains et les urgences environnementales, afin de mener des actions et lutter contre la pollution urbaine.
            </p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 shadow-2xl">
            <img 
              src={images[currentImageIndex].src}
              alt={images[currentImageIndex].alt}
              className="w-full h-auto rounded-xl transition-all duration-1000 ease-in-out"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default WasteProblemSection;