import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Target, Users, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Rends ton quartier zo
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Rends ton quartier <span className="text-accent font-semibold">propre</span> et gagne tes points HIMPACT
          </p>
        </div>

        {/* Le Problème */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Le Défi des Déchets Urbains</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                Difficile de ne pas la remarquer, cette guerre que mènent toutes les grandes villes africaines contre les déchets urbains. Ces saletés qui envahissent nos quartiers, nos rues et leurs abords donnent un triste visage à notre continent.
              </p>
              <p className="text-lg text-foreground leading-relaxed">
                Dans le Grand Abidjan, <span className="text-accent font-semibold">1,4 million de tonnes</span> de déchets sont produits chaque année. Ce chiffre, conséquence directe d'une urbanisation galopante et d'une forte croissance démographique, se reflète à l'échelle de toute l'Afrique subsaharienne.
              </p>
            </div>
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">174M</div>
                  <div className="text-sm text-muted-foreground">tonnes en 2016</div>
                  <div className="text-2xl">→</div>
                  <div className="text-4xl font-bold text-destructive">516M</div>
                  <div className="text-sm text-muted-foreground">tonnes prévues en 2050</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Notre Solution */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Notre Solution : La Ligne Verte</h2>
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
              <CardContent className="p-8">
                <p className="text-lg text-foreground leading-relaxed mb-6">
                  C'est à cette résignation que <span className="text-primary font-semibold">Greenpill Côte d'Ivoire</span> a décidé de dire non, en lançant La Ligne Verte.
                </p>
                <p className="text-lg text-foreground leading-relaxed">
                  La Ligne Verte est une solution technologique développée pour lutter contre la prolifération des déchets dans les zones urbaines et périurbaines. Une plateforme de signalement permettant aux habitants de localiser et de déclarer les dépôts d'ordures et les décharges sauvages dans leur quartier.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comment ça marche */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">1. Repère</h3>
                <p className="text-muted-foreground">Tu repères un dépôt de déchets dans ton quartier ou dans la ville</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">2. Signale</h3>
                <p className="text-muted-foreground">Tu le prends en photo et l'envoies à notre chatbot Débora avec la localisation</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">3. Gagne</h3>
                <p className="text-muted-foreground">Si le signalement est validé, tu reçois des points HIMPACT cumulables</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technologie */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Technologie & Transparence</h2>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-secondary/20 to-primary/10">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Blockchain & Traçabilité</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Toutes les données sont sauvegardées sur la blockchain pour garantir leur fiabilité et leur traçabilité. Signalements, localisations et points sont sécurisés.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Intelligence Artificielle</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      La validation sera progressivement appuyée par l'IA pour optimiser la lutte contre les déchets urbains grâce aux outils technologiques.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vision */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">Notre Vision</h2>
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30">
            <CardContent className="p-8">
              <div className="flex items-center justify-center mb-6">
                <Users className="w-12 h-12 text-primary" />
              </div>
              <p className="text-lg text-foreground leading-relaxed">
                Optimiser la lutte contre les déchets urbains grâce aux outils technologiques et à la force communautaire, tout en évaluant l'impact des actions publiques, privées et citoyennes sur la protection de la biodiversité dans nos zones urbaines et périurbaines.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;