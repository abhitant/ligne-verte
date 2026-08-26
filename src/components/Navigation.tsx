import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, Home, Swords, Menu, X, Info, Settings, LogOut, Trophy } from "lucide-react";
import { WHATSAPP_INVITE_URL, WHATSAPP_INVITE_URL_FALLBACK, TELEGRAM_BOT_URL } from "@/config/links";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/hooks/useAuth";
import WaitlistModal from "./WaitlistModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navigation = [
    { name: 'Base', href: '/', icon: Home },
    { name: 'Carte', href: '/carte', icon: MapPin },
    { name: 'Défis', href: '/defis', icon: Swords },
    { name: 'Classement', href: '/classement', icon: Trophy },
    { name: 'Intel', href: '/a-propos', icon: Info },
  ];

  const adminNavigation = isAdmin ? [
    { name: 'Contrôle', href: '/dashboard', icon: Settings },
  ] : [];

  const allNavigation = [...navigation, ...adminNavigation];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/lovable-uploads/bca28378-ee5f-4a53-98dd-d742ca7d646d.png"
              alt="Logo La Ligne Verte"
              className="w-9 h-9"
            />
            <div className="flex flex-col leading-none">
              <span className="font-display text-base sm:text-lg uppercase tracking-widest text-foreground">
                Ligne Verte
              </span>
              
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {allNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors border ${
                    isActive(item.href)
                      ? 'border-accent/60 text-accent bg-accent/10'
                      : 'border-transparent text-muted-foreground hover:text-accent hover:border-accent/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center flex-shrink-0 ml-2">
            {user ? (
              <Button
                variant="outline"
                className="border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground bg-transparent font-mono text-xs uppercase tracking-[0.18em]"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-mono text-xs uppercase tracking-[0.18em]">
                    En savoir plus sur Déborah
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-56 p-2">
                  <a
                    href={WHATSAPP_INVITE_URL}
                    className="block px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-accent hover:bg-accent/10"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={TELEGRAM_BOT_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-2 font-mono text-xs uppercase tracking-[0.18em] text-accent hover:bg-accent/10"
                  >
                    Telegram
                  </a>
                  <a
                    href={WHATSAPP_INVITE_URL_FALLBACK}
                    target="_blank"
                    rel="noreferrer"
                    className="block px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent"
                  >
                    Lien WhatsApp alternatif
                  </a>
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Mobile toggle */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Ouvrir le menu"
              className="p-2 text-accent"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-border pt-3 space-y-1">
            {allNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 font-mono text-xs uppercase tracking-[0.18em] border ${
                    isActive(item.href)
                      ? 'border-accent/60 text-accent bg-accent/10'
                      : 'border-transparent text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            <div className="pt-3">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full border-accent/50 text-accent bg-transparent font-mono text-xs uppercase tracking-[0.18em]"
                  onClick={() => { handleSignOut(); setIsOpen(false); }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </Button>
              ) : (
                <Button
                  asChild
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-mono text-xs uppercase tracking-[0.18em]"
                  onClick={() => setIsOpen(false)}
                >
                  <a href={WHATSAPP_INVITE_URL}>En savoir plus sur Déborah</a>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>

      <WaitlistModal
        isOpen={isWaitlistOpen}
        onClose={() => setIsWaitlistOpen(false)}
        redirectAfterSubmit
        whatsappUrl={WHATSAPP_INVITE_URL}
      />
    </nav>
  );
};

export default Navigation;
