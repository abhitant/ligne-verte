
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Target, Trophy, Zap, ArrowRight, Heart } from "lucide-react";

const JoinMovement = () => {
  const steps = [
    {
      icon: Target,
      title: "Signale",
      description: "Prends une photo d'une zone insalubre",
      points: "+50 points",
      color: "bg-blue-500"
    },
    {
      icon: Users,
      title: "Mobilise",
      description: "Organise ton quartier pour agir",
      points: "+200 points",
      color: "bg-emerald-500"
    },
    {
      icon: Trophy,
      title: "Transforme",
      description: "Vois ton quartier devenir ZO",
      points: "+500 points",
      color: "bg-yellow-500"
    }
  ];

  const testimonials = [
    {
      name: "Aïcha K.",
      location: "Cocody",
      message: "Grâce à La Ligne Verte, notre quartier est méconnaissable ! Plus de dépôts sauvages.",
      points: 1250
    },
    {
      name: "Moussa D.",
      location: "Yopougon", 
      message: "J'ai organisé 5 actions de nettoyage. Mes voisins me remercient chaque jour.",
      points: 2800
    },
    {
      name: "Fatou S.",
      location: "Abobo",
      message: "Mes enfants peuvent enfin jouer dehors sans risque. Merci La Ligne Verte !",
      points: 950
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Heart className="w-4 h-4 mr-2" />
            REJOINS LE MOUVEMENT
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Deviens un héros de ton quartier
          </h2>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-12">
            Rejoins des milliers d'Ivoiriens qui transforment leur environnement.
            <br />
            Chaque geste compte, chaque point rapproche Abidjan d'un avenir plus vert.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl hover:bg-white/20 transition-all">
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-emerald-100 mb-4">{step.description}</p>
                  <div className="inline-flex items-center bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold">
                    <Zap className="w-4 h-4 mr-1" />
                    {step.points}
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-emerald-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Ils ont transformé leur quartier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-white">{testimonial.name}</h4>
                      <p className="text-emerald-200 text-sm">{testimonial.location}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">{testimonial.points}</div>
                      <div className="text-emerald-200 text-xs">points</div>
                    </div>
                  </div>
                  <p className="text-emerald-100 italic">"{testimonial.message}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Card className="bg-gradient-to-r from-yellow-400 to-orange-500 shadow-2xl">
          <CardContent className="p-12 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à faire la différence ?
            </h3>
            <p className="text-lg text-gray-800 mb-8 opacity-90">
              Commence dès maintenant et gagne tes premiers points Himpact
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl">
                <Target className="w-5 h-5 mr-2" />
                Faire mon premier signalement
              </Button>
              <Button variant="outline" size="lg" className="border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-4 text-lg rounded-xl">
                <Users className="w-5 h-5 mr-2" />
                Rejoindre la communauté
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JoinMovement;
