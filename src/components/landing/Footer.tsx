import { MessageSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card py-12 border-t border-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Copyright */}
          <div className="text-card-foreground">
            © La Ligne Verte 2025
          </div>

          {/* Links */}
          <div className="flex gap-8 text-muted-foreground">
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
            <a href="#" className="hover:text-accent transition-colors">FAQ</a>
            <a href="#" className="hover:text-accent transition-colors">Politique de confidentialité</a>
          </div>

          {/* Social */}
          <div className="flex items-center gap-4">
            <a 
              href="https://t.me/your_bot" 
              className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageSquare className="w-6 h-6" />
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;