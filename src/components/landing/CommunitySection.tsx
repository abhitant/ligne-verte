import { Link } from "react-router-dom";
import deboraTrophy from "@/assets/debora-trophy.png";


const CommunitySection = () => {
  return (
    <section id="reconnaissance" className="relative py-24 bg-surface/30 overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="relative flex justify-center lg:justify-start">
            <div className="absolute -inset-6 bg-accent/10 blur-3xl rounded-full" />
            <img
              src={deboraTrophy}
              alt="Déborah tend un trophée aux contributeurs"
              width={1024}
              height={1024}
              loading="lazy"
              className="relative w-56 sm:w-72 lg:w-80 h-auto object-contain drop-shadow-2xl"
            />
          </div>

          <div>
            <span className="hud-label">Reconnaissance</span>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              Contribue et sois <span className="text-accent">reconnu</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Chaque signalement validé compte : une mission repérée, un quartier un peu plus
              propre, une action visible par tout le monde. Ta régularité te place sur le
              classement public. Tes contributions deviennent une preuve concrète de ton engagement
              pour le quartier et peuvent donner accès aux avantages proposés par La Ligne Verte.
            </p>
            <Link
              to="/classement"
              className="mt-5 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline"
            >
              Découvrir le classement →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
