import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, MapPin, Trophy, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const SolutionSection = () => {
  return (
    <div className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Layout avec image à gauche et contenu à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image à gauche */}
          <div className="relative">
            <img
              src="/lovable-uploads/79ecd174-464d-4573-a561-22942396adf3.png"
              alt="Jeune femme souriante en t-shirt vert"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="mt-4 text-center">
              <p className="text-lg text-muted-foreground italic">
                "Hello, je suis Débora standardiste pour la ligne verte. Je serais ravie de recevoir votre aide dans notre lutte contre les déchets urbains"
              </p>
            </div>
          </div>

          {/* Contenu à droite */}
          <div className="space-y-8">
            {/* Header */}
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                Aide-nous à y mettre fin
              </h2>
            </div>

            {/* Fonctionnement en liste */}
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">✅ Prend une photo et localise les urgences environemental</h3>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">✅ Envoie-la à Débora notre standardiste</h3>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">✅ Ton action apparaît sur notre carte publique</h3>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">✅ Gagne des points et grimpe dans le classement</h3>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-6">
              <Link to="/rejoindre">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-xl font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all">
                  <MessageSquare className="w-6 h-6 mr-3" />
                  Contacter Débora
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolutionSection;