import { Card, CardContent } from "@/components/ui/card";
import { Trash2, MapPin, TrendingDown } from "lucide-react";

const WasteProblemSection = () => {
  return (
    <div className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Les déchets urbains dégradent nos villes et quartiers
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Chaque jour, des tonnes de déchets s'accumulent dans nos rues, sur nos plages et dans nos caniveaux, rendant notre cadre de vie insalubre.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card border-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <Trash2 className="w-16 h-16 mx-auto mb-4 text-accent" />
              <div className="text-5xl font-bold mb-2 text-accent">4 000 000</div>
              <div className="text-lg text-card-foreground font-medium">tonnes de déchets/an</div>
              <div className="text-sm text-muted-foreground mt-2">Côte d'Ivoire</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <MapPin className="w-16 h-16 mx-auto mb-4 text-accent" />
              <div className="text-5xl font-bold mb-2 text-accent">2 000 000</div>
              <div className="text-lg text-card-foreground font-medium">tonnes</div>
              <div className="text-sm text-muted-foreground mt-2">Ville d'Abidjan</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-accent/20 hover:border-accent/40 transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-8 text-center">
              <TrendingDown className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <div className="text-5xl font-bold mb-2 text-red-500">50%</div>
              <div className="text-lg text-card-foreground font-medium">finissent dans les rues</div>
              <div className="text-sm text-muted-foreground mt-2">Déchets non traités</div>
            </CardContent>
          </Card>
        </div>

        {/* Illustration avec pictogrammes */}
        <div className="flex justify-center items-center gap-8 text-accent text-6xl">
          <div className="text-center">
            <div className="text-8xl mb-2">🗑️</div>
            <div className="text-sm text-muted-foreground">Déchets</div>
          </div>
          <div className="text-4xl">→</div>
          <div className="text-center">
            <div className="text-8xl mb-2">🦟</div>
            <div className="text-sm text-muted-foreground">Insalubrité</div>
          </div>
          <div className="text-4xl">→</div>
          <div className="text-center">
            <div className="text-8xl mb-2">🏙️</div>
            <div className="text-sm text-muted-foreground">Dégradation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteProblemSection;