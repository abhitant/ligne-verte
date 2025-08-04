import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, MessageCircle, Send } from "lucide-react";

const Suggestions = () => {
  const [formData, setFormData] = useState({
    suggestionType: "",
    content: "",
    email: "",
    telegramId: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const suggestionTypes = [
    { value: "bug", label: "🐛 Signaler un bug", description: "Un problème technique ou une erreur" },
    { value: "improvement", label: "⚡ Amélioration", description: "Améliorer une fonctionnalité existante" },
    { value: "problem", label: "❗ Problème", description: "Un souci d'utilisation ou de compréhension" },
    { value: "feature", label: "💡 Nouvelle fonctionnalité", description: "Proposer une nouvelle feature" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.suggestionType || !formData.content.trim()) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.rpc('create_suggestion', {
        p_telegram_id: formData.telegramId || 'web_user',
        p_suggestion_type: formData.suggestionType,
        p_content: formData.content + (formData.email ? `\n\nContact: ${formData.email}` : '')
      });

      if (error) {
        console.error('Error creating suggestion:', error);
        toast.error("Erreur lors de l'envoi de votre suggestion");
        return;
      }

      setIsSubmitted(true);
      toast.success("Suggestion envoyée avec succès !");
      
      // Reset form
      setFormData({
        suggestionType: "",
        content: "",
        email: "",
        telegramId: ""
      });

    } catch (error) {
      console.error('Error:', error);
      toast.error("Une erreur s'est produite");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="pt-8 text-center">
            <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Merci !</h2>
            <p className="text-muted-foreground mb-6">
              Votre suggestion a été envoyée avec succès. Nous l'examinerons attentivement.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline"
              className="mr-4"
            >
              Faire une autre suggestion
            </Button>
            <Button 
              onClick={() => window.location.href = '/'}
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Donnez votre avis
          </h1>
          <p className="text-muted-foreground">
            Aidez-nous à améliorer HimpactLive en partageant vos suggestions, signalant des bugs ou proposant de nouvelles fonctionnalités.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formulaire de suggestion</CardTitle>
            <CardDescription>
              Tous les champs marqués d'un * sont obligatoires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="suggestionType">Type de suggestion *</Label>
                <Select 
                  value={formData.suggestionType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, suggestionType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choisissez le type de suggestion" />
                  </SelectTrigger>
                  <SelectContent>
                    {suggestionTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Description détaillée *</Label>
                <Textarea
                  id="content"
                  placeholder="Décrivez votre suggestion en détail..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optionnel)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Laissez votre email si vous souhaitez être contacté pour un suivi
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegramId">ID Telegram (optionnel)</Label>
                <Input
                  id="telegramId"
                  placeholder="Votre ID Telegram"
                  value={formData.telegramId}
                  onChange={(e) => setFormData(prev => ({ ...prev, telegramId: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  Si vous utilisez notre bot Telegram, indiquez votre ID pour lier votre suggestion
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer la suggestion
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Vous pouvez aussi nous contacter directement via notre{" "}
            <a 
              href="https://t.me/HimpactBot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              bot Telegram
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;