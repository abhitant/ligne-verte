
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { MapPin, Home, Users, Menu, X, Info, Settings, LogOut } from "lucide-react";
import { WHATSAPP_INVITE_URL } from "@/config/links";
import { useAuth } from "@/hooks/useAuth";
import WaitlistModal from "./WaitlistModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Carte', href: '/carte', icon: MapPin },
    { name: 'Classement', href: '/classement', icon: Users },
    { name: 'À propos', href: '/a-propos', icon: Info },
  ];

  const adminNavigation = isAdmin ? [
    { name: 'Dashboard', href: '/dashboard', icon: Settings },
  ] : [];

  const allNavigation = [...navigation, ...adminNavigation];

  const handleSignOut = async () => {
    await signOut();
  };

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <nav className="bg-primary shadow-lg border-b-4 border-primary sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/bca28378-ee5f-4a53-98dd-d742ca7d646d.png" 
                alt="La Ligne Verte Logo" 
                className="w-8 h-8 sm:w-10 sm:h-10"
              />
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-primary-foreground">La Ligne Verte</span>
                <span className="text-xs text-primary-foreground/70 hidden sm:block">par Greenpill civ 🇨🇮</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-1">
              {allNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Auth/Waitlist buttons */}
          <div className="hidden md:flex items-center flex-shrink-0 ml-2 gap-2">
            {user ? (
              <Button 
                variant="outline"
                className="border-accent text-accent hover:bg-accent/10"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            ) : (
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/80"
                onClick={() => setIsWaitlistOpen(true)}
              >
                Participer à la lutte
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
              {allNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-base font-medium ${
                      isActive(item.href)
                        ? 'bg-accent text-accent-foreground'
                        : 'text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              <div className="pt-4 pb-2 space-y-2">
                {user ? (
                  <Button 
                    variant="outline"
                    className="w-full border-accent text-accent hover:bg-accent/10 py-3 text-base font-medium"
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/80 py-3 text-base font-medium"
                    onClick={() => {
                      setIsWaitlistOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    Participer à la lutte
                  </Button>
                )}
              </div>
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
