import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Eye, Users, LineChart, ArrowRight } from "lucide-react";
import DeboraSay from "@/components/landing/DeboraSay";


const reasons = [
  {
    icon: Eye,
    code: "RAI-01",
    title: "Ce qu'on ne voit pas ne se règle pas",
    desc: "« Tant que le problème reste dans ta rue seulement, personne ne bouge. Dès que tu me l'envoies, il devient visible sur la carte, avec la photo, l'heure et le lieu. »",
  },
  {
    icon: Users,
    code: "RAI-02",
    title: "La cité parle d'une seule voix",
    desc: "« Un signalement tout seul, c'est une plainte. Cent signalements au même endroit, c'est une preuve. C'est comme ça qu'on fait bouger les choses. »",
  },
  {
    icon: LineChart,
    code: "RAI-03",
    title: "Des données ouvertes, pas des rumeurs",
    desc: "« Chaque mission validée par mon IA devient une donnée publique que les habitants, les mairies et les ONG peuvent utiliser. »",
  },
];

const WhySection = () => {
  return (
    <section id="pourquoi" className="relative py-24 bg-surface/40 overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-25 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <p className="hud-label mb-4">Débora // pourquoi c'est important</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              Ce qu'on ne voit pas,
              <span className="block text-accent">personne ne le règle</span>
            </h2>

            <DeboraSay
              className="mt-8"
              pose="point"
              line="« Moi je suis à la standardiste : je reçois, je vérifie, je place le point. Mais sans toi sur le terrain, ma carte reste vide. »"
              cta={{ label: "Voir la carte", to: "/carte" }}
            />

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/carte">
                <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-display uppercase tracking-widest">
                  Voir la carte
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/signalements">
                <Button
                  variant="outline"
                  className="border-accent/50 text-accent hover:bg-accent hover:text-accent-foreground font-display uppercase tracking-widest bg-transparent"
                >
                  Les signalements
                </Button>
              </Link>
            </div>

          </div>

          <div className="lg:col-span-7 space-y-px bg-border/60 border border-border/60">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <article key={r.code} className="bg-card p-7 flex gap-5">
                  <Icon className="w-7 h-7 text-accent shrink-0 mt-1" />
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl uppercase tracking-wide">{r.title}</h3>
                      <span className="hud-meta">{r.code}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
