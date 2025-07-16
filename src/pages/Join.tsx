
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle, Users, MapPin, CheckCircle, ArrowRight, Leaf, Heart, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Join = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    zone: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const zones = [
    'Cocody', 'Yopougon', 'Adjamé', 'Plateau', 'Marcory', 'Treichville',
    'Koumassi', 'Port-Bouët', 'Attécoubé', 'Abobo', 'Bingerville', 'Autre'
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Points Himpact',
      description: 'Gagnez des points à chaque signalement validé'
    },
    {
      icon: Users,
      title: 'Communauté active',
      description: 'Rejoignez +3000 citoyens engagés'
    },
    {
      icon: Heart,
      title: 'Impact réel',
      description: 'Vos actions transforment votre quartier'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi
    setTimeout(() => {
      toast({
        title: "Bienvenue dans La Ligne Verte ! 🎉",
        description: "Votre inscription a été confirmée. Consultez votre email pour commencer.",
      });
      setIsSubmitting(false);
      setFormData({ name: '', email: '', zone: '', motivation: '' });
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="h-12 w-12 text-green-600" />
            <h1 className="text-4xl font-bold text-green-800">Rejoindre La Ligne Verte</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Devenez un acteur du changement environnemental en Côte d'Ivoire
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="bg-card shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6 text-green-600" />
                Inscription à la communauté
              </CardTitle>
              <CardDescription>
                Remplissez ce formulaire pour rejoindre notre mouvement citoyen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Votre nom et prénom"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="zone">Zone d'action *</Label>
                  <select
                    id="zone"
                    value={formData.zone}
                    onChange={(e) => handleInputChange('zone', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Choisissez votre commune</option>
                    {zones.map((zone) => (
                      <option key={zone} value={zone}>{zone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="motivation">Pourquoi rejoindre ? (optionnel)</Label>
                  <textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    placeholder="Dites-nous ce qui vous motive à agir pour l'environnement..."
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 resize-none"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Inscription en cours...' : 'Rejoindre la communauté'}
                  {!isSubmitting && <ArrowRight className="w-5 h-5 ml-2" />}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Info & Benefits */}
          <div className="space-y-6">
            {/* Benefits */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-800">Pourquoi nous rejoindre ?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{benefit.title}</h3>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Telegram Bot CTA */}
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6" />
                  Commencez dès maintenant !
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Pas besoin d'attendre ! Démarrez immédiatement avec notre bot Telegram.
                </p>
                <Button 
                  className="bg-primary text-primary-foreground hover:bg-primary/90 w-full" 
                  size="lg"
                >
                  <a 
                    href="https://t.me/LigneVerteBot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 w-full justify-center"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Démarrer le bot Telegram
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* Process */}
            <Card className="bg-green-50 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Après votre inscription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>Email de confirmation avec guide de démarrage</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>Accès au groupe Telegram de votre zone</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>Formation en ligne (optionnelle)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                  <span>Premier signalement et premiers points !</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;
