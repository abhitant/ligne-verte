import DeboraSay from "@/components/landing/DeboraSay";
import ReportsCarousel from "@/components/landing/ReportsCarousel";
import TacticalMap from "@/components/landing/TacticalMap";



const WasteProblemSection = () => {
  return (
    <section id="categories" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Texte + Débora */}
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              Nos quartiers <span className="text-alert">croulent</span> sous la menace.
            </h2>

            <DeboraSay
              className="mt-8"
              pose="point"
              line="« Incivisme, salubrité, voirie, éclairage… Chaque jour, des problèmes s'accumulent dans nos rues. Si on ne les voit pas, on ne les règle pas. C'est pour ça que La Ligne Verte existe : pour les repérer, les cartographier et les résoudre ensemble. »"
              cta={{ label: "Les signalements", to: "/signalements" }}
            />
          </div>

          {/* Carrousel des signalements reçus */}
          <ReportsCarousel />
        </div>

        {/* Présentation de la plateforme avant la carte */}
        <div className="mt-16 hud-panel p-6 lg:p-8">
          <div className="flex items-center justify-between mb-5">
            <span className="hud-label">Briefing</span>
            <span className="hud-meta hidden sm:inline">PLATEFORME CIVIQUE</span>
          </div>
          <p className="text-lg md:text-xl text-foreground leading-relaxed max-w-4xl">
            <span className="text-accent font-display uppercase tracking-wide">La Ligne Verte</span> est la plateforme de gestion civique des quartiers. Elle permet à chaque habitant de signaler, en direct et sans formulaire compliqué, tout ce qui dégrade la vie de la cité. Les signalements sont analysés par une IA, validés, puis affichés sur une carte publique pour faire bouger les lignes.
          </p>
        </div>

        {/* Carte tactique + informations live */}
        <div className="mt-6">
          <TacticalMap />
        </div>
      </div>
    </section>
  );
};

export default WasteProblemSection;