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
            <div className="relative h-64 sm:h-80 lg:h-96 w-auto overflow-hidden">
              <img
                src={deboraTrophy}
                alt="Déborah tend un trophée aux contributeurs"
                width={1024}
                height={1024}
                loading="lazy"
                className="relative h-full w-auto object-contain object-top drop-shadow-[0_0_45px_hsl(var(--accent)/0.28)]"
                style={{
                  maskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
                  WebkitMaskImage: 'linear-gradient(to bottom, black 72%, transparent 100%)',
                }}
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold uppercase leading-tight md:text-5xl">
              Contribue et sois <span className="text-accent">reconnu</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Chaque signalement validé compte. Une mission repérée, un quartier un peu plus
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
