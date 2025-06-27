
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, Gift, Users, Leaf, Smartphone, ArrowRight, CheckCircle, Play, TrendingUp, Calendar, Star, BarChart3, Headphones, Monitor } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const [stats] = useState({
    zonesSignalees: 1250,
    gardiens: 500,
    quartiersZo: 85
  });

  const services = [
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Créez des applications mobiles qui transforment votre quartier",
      image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: Monitor,
      title: "Web App Development", 
      description: "Développez des plateformes web pour engager votre communauté",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: Users,
      title: "Internal Tool Development",
      description: "Construisez des outils internes pour optimiser vos processus",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80"
    }
  ];

  const features = [
    {
      icon: TrendingUp,
      title: "Solutions Réactives",
      description: "Des outils qui s'adaptent rapidement aux besoins de votre communauté"
    },
    {
      icon: Headphones,
      title: "Support Fiable",
      description: "Un accompagnement constant pour maximiser votre impact social"
    },
    {
      icon: Monitor,
      title: "Systèmes Sécurisés",
      description: "Une infrastructure robuste pour protéger les données de vos utilisateurs"
    }
  ];

  const testimonials = [
    {
      company: "Brandico Services",
      text: "La plateforme nous a permis d'engager notre communauté de manière innovante et efficace."
    },
    {
      company: "Geobridge Logistics", 
      text: "Grâce aux outils développés, nous avons pu optimiser nos processus de signalement."
    },
    {
      company: "Habitat Factory",
      text: "Une solution qui répond parfaitement aux défis urbains de notre époque."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white">LA LIGNE VERTE</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-white hover:text-green-300 transition-colors text-sm">Accueil</Link>
            <Link to="/map" className="text-white hover:text-green-300 transition-colors text-sm">Carte</Link>
            <Link to="/marketplace" className="text-white hover:text-green-300 transition-colors text-sm">Marketplace</Link>
            <Link to="/join" className="text-white hover:text-green-300 transition-colors text-sm">À propos</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-green-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-green-500 rounded-full opacity-30 blur-2xl"></div>
        </div>
        
        <div className="relative h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Rends ton quartier
                  <br />
                  <span className="text-green-400">Zo</span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  et prends tes points.
                </p>
                
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-4 rounded-full">
                  FAIRE UN SIGNALEMENT
                </Button>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-2xl p-2 shadow-2xl transform rotate-3">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80" 
                    alt="Woman working" 
                    className="w-full h-80 object-cover rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Solutions Section */}
      <div className="py-20 bg-green-400">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&w=500&q=80" 
                alt="Team working" 
                className="w-full h-96 object-cover rounded-2xl"
              />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Solutions Personnalisées ?<br />
                <span className="text-gray-800">Comptez sur nous.</span>
              </h2>
              <p className="text-gray-800 mb-8 leading-relaxed">
                Nous développons des plateformes sur mesure pour transformer l'engagement citoyen. 
                Que vous ayez besoin d'une application mobile, d'une plateforme web ou d'outils internes, 
                nous créons des solutions qui génèrent un impact réel dans votre communauté.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-green-400 text-center mb-16">
            Ce Que Nous Pouvons Faire Pour Vous
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-green-400 border-0 overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <service.icon className="w-6 h-6 text-gray-900" />
                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Us Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 text-center mb-16">Pourquoi Nous</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-green-400 leading-relaxed">
            Attirez l'attention avec une ligne qui définit la mission, 
            la vision ou la philosophie de l'entreprise.<br />
            <span className="text-white">Les mots inspirants du travail des gens marchent aussi !</span>
          </h2>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-green-400">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">
            Retours Clients
          </h2>
          
          <div className="space-y-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{testimonial.company}</h3>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-800 text-lg leading-relaxed">"{testimonial.text}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-green-400 mb-8">
                Laissez-nous vous aider.
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold mb-2">TÉLÉPHONE</h3>
                  <p className="text-gray-300">(225) 345-6789</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">E-MAIL</h3>
                  <p className="text-gray-300">contact@ligneverte.com</p>
                </div>
                
                <div>
                  <h3 className="text-white font-semibold mb-2">SOCIAL</h3>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-full mt-8">
                CONTACTEZ-NOUS
              </Button>
            </div>
            
            <div className="relative">
              <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=500&q=80" 
                  alt="Team collaboration" 
                  className="w-full h-80 object-cover rounded-xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-green-400 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
