import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WHATSAPP_INVITE_URL, WHATSAPP_INVITE_URL_FALLBACK, TELEGRAM_BOT_URL } from "@/config/links";
import type { Challenge } from "@/hooks/useChallenges";

const steps = [
  "Ouvre la conversation avec Déborah sur WhatsApp ou Telegram.",
  "Prends la photo du problème sur la zone du défi.",
  "Envoie la photo, puis partage ta position.",
  "Déborah analyse et valide : tu prends tes points habituels + le bonus du défi.",
];

interface Props {
  challenge: Challenge;
  trigger: React.ReactNode;
}

const ChallengeJoinDialog = ({ challenge, trigger }: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl uppercase tracking-tight">
            {challenge.title}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Voici comment participer et empocher <span className="text-accent">+{challenge.bonus_points}</span>{" "}
            points Himpact bonus{challenge.zone ? ` sur ${challenge.zone}` : ""}.
          </DialogDescription>
        </DialogHeader>

        <ol className="space-y-3">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-accent/60 font-mono text-[0.65rem] text-accent">
                {i + 1}
              </span>
              <span className="text-sm text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            asChild
            className="flex-1 bg-accent font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/90"
          >
            <a href={WHATSAPP_INVITE_URL}>WhatsApp</a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-accent/50 bg-transparent font-mono text-xs uppercase tracking-[0.18em] text-accent"
          >
            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer">
              Telegram
            </a>
          </Button>
        </div>
        <a
          href={WHATSAPP_INVITE_URL_FALLBACK}
          target="_blank"
          rel="noreferrer"
          className="hud-meta text-center text-[0.6rem] underline-offset-4 hover:underline"
        >
          WhatsApp ne s'ouvre pas ? Clique ici
        </a>
      </DialogContent>
    </Dialog>
  );
};

export default ChallengeJoinDialog;
