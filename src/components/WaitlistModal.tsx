import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, User, MapPin, MessageSquare, Phone } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitlistModal = ({ isOpen, onClose }: WaitlistModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zone: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Appeler la fonction Supabase pour sauvegarder les données
      const { error } = await supabase.rpc('add_to_waitlist', {
        p_name: formData.name,
        p_email: formData.email,
        p_phone: formData.phone,
        p_zone: formData.zone,
        p_motivation: formData.motivation || null
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Inscription réussie !",
        description: "Tu as été ajouté(e) à notre liste d'attente. Nous te contacterons bientôt.",
      });

      setFormData({ name: '', email: '', phone: '', zone: '', motivation: '' });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-foreground">
            Rejoins la lutte contre les déchets
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Nom complet
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ton nom complet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="ton.email@exemple.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Numéro de téléphone (international)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+33 1 23 45 67 89, +225 XX XX XX XX XX, +1 555 123 4567..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zone" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Zone d'habitation
            </Label>
            <Input
              id="zone"
              value={formData.zone}
              onChange={(e) => handleInputChange('zone', e.target.value)}
              placeholder="Ex: Cocody, Yopougon, Abobo..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivation" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Pourquoi veux-tu participer ?
            </Label>
            <Textarea
              id="motivation"
              value={formData.motivation}
              onChange={(e) => handleInputChange('motivation', e.target.value)}
              placeholder="Dis-nous ce qui te motive à lutter contre les déchets..."
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Inscription...' : 'Rejoindre la lutte'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistModal;