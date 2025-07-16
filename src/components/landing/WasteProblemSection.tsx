import { Card, CardContent } from "@/components/ui/card";
import { Trash2, MapPin, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import ligneVerteLogo from "@/assets/ligne-verte-logo.png";

const WasteProblemSection = () => {
  const [visibleCards, setVisibleCards] = useState<number[]>([]);

  useEffect(() => {
    // Animation séquentielle des cartes
    const timers = [
      setTimeout(() => setVisibleCards(prev => [...prev, 0]), 500),
      setTimeout(() => setVisibleCards(prev => [...prev, 1]), 1000),
      setTimeout(() => setVisibleCards(prev => [...prev, 2]), 1500),
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

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

        {/* Section texte et logo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-foreground">
            <p className="text-2xl md:text-3xl font-bold leading-relaxed">
              La ligne verte a pour mission de faire disparaitre la polution urbaine due aux déchets, grace à l'action citoyene.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <img 
              src={ligneVerteLogo} 
              alt="Logo de la ligne verte"
              className="w-32 h-32 md:w-40 md:h-40 object-contain filter drop-shadow-lg"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default WasteProblemSection;