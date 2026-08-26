import TacticalMap from "@/components/landing/TacticalMap";

const CivicMapSection = () => {
  return (
    <section id="carte-live" className="relative overflow-hidden bg-surface/30 py-24">
      <div className="hud-grid pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-4xl">
          <span className="hud-label">Briefing</span>
          <p className="mt-4 text-lg leading-relaxed text-foreground md:text-xl">
            <span className="font-display uppercase tracking-wide text-accent">La Ligne Verte</span> est
            la plateforme de gestion civique des quartiers. Chaque habitant peut signaler ce qui
            dégrade la vie de la cité. Les signalements sont analysés, validés puis affichés sur une
            carte publique pour faire bouger les lignes.
          </p>
        </div>
        <TacticalMap />
      </div>
    </section>
  );
};

export default CivicMapSection;