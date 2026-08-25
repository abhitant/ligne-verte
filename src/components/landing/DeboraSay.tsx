import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import deboraWave from "@/assets/debora-wave.png";
import deboraPoint from "@/assets/debora-point.png";

const poses = { wave: deboraWave, point: deboraPoint };

type Props = {
  line: string;
  pose?: "wave" | "point";
  cta?: { label: string; to: string; external?: boolean };
  side?: "left" | "right";
  className?: string;
};

/** Débora qui explique une section : sa tête arrive à côté du contenu au scroll. */
const DeboraSay = ({ line, pose = "point", cta, side = "left", className = "" }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.35 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left gap-4 ${side === "right" ? "sm:flex-row-reverse sm:text-right" : ""} ${className}`}
    >
      <div className="relative shrink-0">
        <div className="absolute -inset-4 bg-accent/10 blur-2xl rounded-full" />
        <img
          src={poses[pose]}
          alt="Débora, la standardiste de La Ligne Verte"
          width={768}
          height={1024}
          loading="lazy"
          className={`relative w-24 sm:w-36 lg:w-44 h-auto object-contain transition-all duration-700 ease-out ${
            shown
              ? "opacity-100 translate-x-0"
              : `opacity-0 ${side === "right" ? "translate-x-10" : "-translate-x-10"}`
          } ${side === "right" ? "scale-x-[-1]" : ""}`}
        />
      </div>


      <div
        className={`hud-panel p-4 max-w-sm relative transition-all duration-700 delay-150 ease-out ${
          shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <p className="hud-label mb-2">Débora // standardiste</p>
        <p className="text-sm text-foreground leading-relaxed">{line}</p>
        {cta &&
          (cta.external ? (
            <a
              href={cta.to}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline"
            >
              {cta.label} →
            </a>
          ) : (
            <Link
              to={cta.to}
              className="mt-3 inline-block font-mono text-xs uppercase tracking-[0.2em] text-accent hover:underline"
            >
              {cta.label} →
            </Link>
          ))}
      </div>
    </div>
  );
};

export default DeboraSay;
