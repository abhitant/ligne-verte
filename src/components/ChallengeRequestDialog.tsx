import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const schema = z.object({
  organization_name: z.string().trim().min(2, "Nom de l'organisation requis").max(120),
  contact_name: z.string().trim().min(2, "Nom du contact requis").max(120),
  email: z.string().trim().email("Adresse e-mail invalide").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  zone: z.string().trim().max(120).optional().or(z.literal("")),
  description: z.string().trim().min(20, "Décris ton défi (20 caractères min.)").max(1500),
});

interface Props {
  trigger: React.ReactNode;
}

const ChallengeRequestDialog = ({ trigger }: Props) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = {
      organization_name: String(fd.get("organization_name") ?? ""),
      contact_name: String(fd.get("contact_name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      zone: String(fd.get("zone") ?? ""),
      description: String(fd.get("description") ?? ""),
    };

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }

    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("challenge_requests").insert({
      organization_name: parsed.data.organization_name,
      contact_name: parsed.data.contact_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      zone: parsed.data.zone || null,
      description: parsed.data.description,
    });
    setLoading(false);

    if (error) {
      toast.error("Envoi impossible pour le moment. Réessaie dans un instant.");
      return;
    }

    toast.success("Proposition envoyée ! Débora revient vers toi par e-mail.");
    setOpen(false);
  };

  const field = (name: string) =>
    errors[name] ? <p className="mt-1 font-mono text-[0.65rem] text-destructive">{errors[name]}</p> : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-tight">
            Proposer un défi
          </DialogTitle>
          <DialogDescription className="text-sm">
            Mairie, ONG, entreprise ou association : décris ton défi, on te recontacte par e-mail pour le
            mettre en ligne.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="organization_name" className="hud-meta text-[0.65rem]">Organisation</Label>
            <Input id="organization_name" name="organization_name" maxLength={120} placeholder="Mairie de Cocody" />
            {field("organization_name")}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contact_name" className="hud-meta text-[0.65rem]">Contact</Label>
              <Input id="contact_name" name="contact_name" maxLength={120} placeholder="Nom et prénom" />
              {field("contact_name")}
            </div>
            <div>
              <Label htmlFor="email" className="hud-meta text-[0.65rem]">E-mail</Label>
              <Input id="email" name="email" type="email" maxLength={255} placeholder="contact@org.ci" />
              {field("email")}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="phone" className="hud-meta text-[0.65rem]">Téléphone (optionnel)</Label>
              <Input id="phone" name="phone" maxLength={30} placeholder="+225 ..." />
              {field("phone")}
            </div>
            <div>
              <Label htmlFor="zone" className="hud-meta text-[0.65rem]">Zone visée (optionnel)</Label>
              <Input id="zone" name="zone" maxLength={120} placeholder="Yopougon" />
              {field("zone")}
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="hud-meta text-[0.65rem]">Ton défi</Label>
            <Textarea
              id="description"
              name="description"
              maxLength={1500}
              rows={4}
              placeholder="Objectif, type de signalements attendus, durée, récompense envisagée…"
            />
            {field("description")}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-accent font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/90"
          >
            {loading ? "Envoi…" : "Envoyer ma proposition"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeRequestDialog;
