import { Link } from "react-router-dom";
import { ArrowLeft, Swords, Building2, Timer, Zap, MapPin, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useChallenges, isChallengeActive, daysLeft } from "@/hooks/useChallenges";
import { WHATSAPP_INVITE_URL, TELEGRAM_BOT_URL } from "@/config/links";

const ChallengesPage = () => {
  const { data: challenges = [], isLoading } = useChallenges();
  const active = challenges.filter(isChallengeActive);
  const others = challenges.filter((c) => !isChallengeActive(c));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="relative">
        <div className="pointer-events-none absolute inset-0 hud-grid opacity-30" />

        <div className="relative z-10 mx-auto max-w-5xl px-4 py-10">
          <Link to="/">
            <Button
              variant="ghost"
              size="sm"
              className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:bg-accent/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la base
            </Button>
          </Link>

          <header className="hud-panel mb-8 p-6">
            <span className="hud-label flex items-center gap-2">
              <Swords className="h-4 w-4" /> Défis en cours
            </span>
            <h1 className="mt-2 font-display text-3xl uppercase tracking-tight md:text-4xl">
              Relève un <span className="text-accent">défi</span>, gagne des points bonus
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Des organisations, mairies et ONG lancent des défis sur des zones précises. Tu signales pendant
              la période du défi, ton signalement est validé, et tu empoches les points Himpact bonus en plus
              des points habituels.
            </p>
          </header>

          {isLoading ? (
            <p className="hud-meta py-16 text-center">Chargement des défis…</p>
          ) : challenges.length === 0 ? (
            <div className="hud-panel py-16 text-center">
              <Swords className="mx-auto mb-4 h-10 w-10 text-accent/60" />
              <p className="text-sm text-muted-foreground">Aucun défi actif pour le moment. Reviens vite.</p>
            </div>
          ) : (
            <div className="space-y-8">
              <section className="grid gap-4 md:grid-cols-2">
                {[...active, ...others].map((c) => {
                  const left = daysLeft(c);
                  const running = isChallengeActive(c);
                  return (
                    <article key={c.id} className="hud-panel flex flex-col p-5">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span className="hud-meta flex items-center gap-1 text-[0.65rem]">
                          <Building2 className="h-3 w-3" /> {c.organization_name}
                        </span>
                        <span
                          className={`border px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] ${
                            running
                              ? "border-accent/60 bg-accent/10 text-accent"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {running ? "En cours" : "Terminé"}
                        </span>
                      </div>

                      <h2 className="font-display text-lg uppercase leading-tight tracking-wide">{c.title}</h2>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground">{c.description}</p>

                      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3">
                        <div>
                          <span className="hud-meta text-[0.6rem]">Bonus</span>
                          <p className="flex items-center gap-1 font-display text-base text-accent">
                            <Zap className="h-3.5 w-3.5" /> +{c.bonus_points}
                          </p>
                        </div>
                        <div>
                          <span className="hud-meta text-[0.6rem]">Zone</span>
                          <p className="flex items-center gap-1 text-xs text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-accent" /> {c.zone ?? "Toutes"}
                          </p>
                        </div>
                        <div>
                          <span className="hud-meta text-[0.6rem]">Reste</span>
                          <p className="flex items-center gap-1 text-xs text-foreground">
                            <Timer className="h-3.5 w-3.5 text-accent" />
                            {left === null ? "Illimité" : `${left} j`}
                          </p>
                        </div>
                      </div>

                      {c.target_reports ? (
                        <p className="hud-meta mt-3 flex items-center gap-1 text-[0.6rem]">
                          <Target className="h-3 w-3" /> Objectif collectif : {c.target_reports} signalements
                        </p>
                      ) : null}

                      <div className="mt-4 flex gap-2">
                        <Button
                          asChild
                          className="flex-1 bg-accent font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/90"
                        >
                          <a href={WHATSAPP_INVITE_URL}>Participer</a>
                        </Button>
                        <Button
                          asChild
                          variant="outline"
                          className="border-accent/50 bg-transparent font-mono text-xs uppercase tracking-[0.18em] text-accent"
                        >
                          <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer">
                            Telegram
                          </a>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </section>
            </div>
          )}

          <section className="hud-panel mt-10 p-6">
            <span className="hud-label">Organisations</span>
            <h2 className="mt-2 font-display text-xl uppercase tracking-tight">
              Tu veux lancer ton propre défi ?
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Mairies, ONG, entreprises et associations peuvent créer un défi sur une zone donnée, avec un
              objectif et des points Himpact bonus pour les habitants qui y participent. Écris-nous et on le
              met en ligne.
            </p>
            <Button
              asChild
              className="mt-4 bg-accent font-mono text-xs uppercase tracking-[0.18em] text-accent-foreground hover:bg-accent/90"
            >
              <a href={WHATSAPP_INVITE_URL}>Proposer un défi</a>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ChallengesPage;
