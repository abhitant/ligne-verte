import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, MapPin, Trophy, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";

const SolutionSection = () => {
  return (
    <div className="py-20 bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-card-foreground mb-6">
            Aidez-nous à y mettre fin
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Avec La Ligne Verte, tu peux rendre ta ville plus propre tout en gagnant des points.
          </p>
        </div>

        {/* Fonctionnement */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-background border-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">✅ Prends une photo</h3>
              <p className="text-muted-foreground">de ton action environnementale dans ton quartier.</p>
            </CardContent>
          </Card>

          <Card className="bg-background border-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">✅ Envoie-la via Telegram</h3>
              <p className="text-muted-foreground">à notre standardiste avec ta localisation.</p>
            </CardContent>
          </Card>

          <Card className="bg-background border-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">✅ Ton action</h3>
              <p className="text-muted-foreground">apparaît sur notre carte publique.</p>
            </CardContent>
          </Card>

          <Card className="bg-background border-accent/20 hover:border-accent/40 transition-all duration-300 group">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Trophy className="w-10 h-10 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">✅ Gagne des points</h3>
              <p className="text-muted-foreground">et grimpe dans le classement.</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/rejoindre">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-12 py-6 text-xl font-bold rounded-xl shadow-xl transform hover:scale-105 transition-all">
              <MessageSquare className="w-6 h-6 mr-3" />
              Contacter Débora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SolutionSection;