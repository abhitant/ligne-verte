import { MessageSquare, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { TELEGRAM_BOT_URL, WHATSAPP_INVITE_URL } from "@/config/links";

const Footer = () => {
  return (
    <footer className="relative bg-background border-t border-border">
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="hud-label mb-3">La Ligne Verte</p>
            <p className="font-display text-xl uppercase tracking-wide">
              Centre de commandement civique
            </p>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              « C'est Débora. Écris-moi, rends ton quartier zo et prends tes points. » Un projet
              open source de GreenPill Côte d'Ivoire.
            </p>

          </div>

          <div>
            <p className="hud-label mb-3">Navigation</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/carte" className="hover:text-accent transition-colors">Carte tactique</Link></li>
              <li><Link to="/classement" className="hover:text-accent transition-colors">Classement</Link></li>
              <li><Link to="/signalements" className="hover:text-accent transition-colors">Signalements</Link></li>
              <li><Link to="/a-propos" className="hover:text-accent transition-colors">À propos</Link></li>
            </ul>
          </div>

          <div>
            <p className="hud-label mb-3">Canaux d'urgence</p>
            <div className="flex flex-col gap-3">
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-mono uppercase tracking-widest"
              >
                <MessageSquare className="w-4 h-4" /> Telegram
              </a>
              <a
                href={WHATSAPP_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:text-accent/80 transition-colors font-mono uppercase tracking-widest"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="hud-divider my-10" />

        <div className="flex flex-col sm:flex-row justify-between gap-3 hud-meta">
          <span>© La Ligne Verte {new Date().getFullYear()} · GreenPill CIV 🇨🇮</span>
          <span>Statut système : opérationnel</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
