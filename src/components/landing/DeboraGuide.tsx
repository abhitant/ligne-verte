import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import deboraWave from "@/assets/debora-wave.png";
import deboraPoint from "@/assets/debora-point.png";

type Stop = {
  id: string;
  pose: "wave" | "point";
  line: string;
  cta?: { label: string; to: string; external?: boolean };
};

const poses = { wave: deboraWave, point: deboraPoint };

const DeboraGuide = ({ stops }: { stops: Stop[] }) => {
  const [active, setActive] = useState<Stop | null>(null);
  const [visible, setVisible] = useState(false);
  const lastId = useRef<string | null>(null);

  useEffect(() => {
    const nodes = stops
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    const observer = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!shown) {
          setVisible(false);
          return;
        }
        const stop = stops.find((s) => s.id === shown.target.id);
        if (!stop) return;

        if (stop.id !== lastId.current) {
          lastId.current = stop.id;
          // petit retrait puis retour : Débora "revient" avec un nouveau message
          setVisible(false);
          window.setTimeout(() => {
            setActive(stop);
            setVisible(true);
          }, 320);
        } else {
          setVisible(true);
        }
      },
      { threshold: [0.35, 0.6], rootMargin: "-10% 0px -20% 0px" }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [stops]);

  if (!active) return null;

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-0 left-0 z-40 hidden md:flex items-end gap-3 pl-4 pb-0 pointer-events-none transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="relative">
        <div className="absolute -inset-6 bg-accent/10 blur-2xl rounded-full" />
        <img
          key={active.pose}
          src={poses[active.pose]}
          alt="Débora, la standardiste de La Ligne Verte"
          width={768}
          height={1024}
          loading="lazy"
          className="relative h-[240px] lg:h-[300px] w-auto drop-shadow-[0_0_25px_hsl(var(--accent)/0.25)] animate-rise"
        />
      </div>

      <div className="pointer-events-auto mb-10 max-w-xs hud-panel p-4 relative">
        <span className="absolute -left-1.5 bottom-6 w-3 h-3 rotate-45 bg-card border-l border-b border-border/70" />
        <p className="hud-label mb-2">Débora // standardiste</p>
        <p className="text-sm text-foreground leading-relaxed">{active.line}</p>
        {active.cta &&
          (active.cta.external ? (
            <a
              href={active.cta.to}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline"
            >
              {active.cta.label} →
            </a>
          ) : (
            <Link
              to={active.cta.to}
              className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline"
            >
              {active.cta.label} →
            </Link>
          ))}
      </div>
    </div>
  );
};

export default DeboraGuide;
