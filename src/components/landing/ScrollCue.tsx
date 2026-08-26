import { ChevronDown } from "lucide-react";

interface ScrollCueProps {
  targetId: string;
  label?: string;
}

const ScrollCue = ({ targetId, label = "Continuer" }: ScrollCueProps) => {
  const handleClick = () => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative z-20 -mt-10 flex justify-center pb-6">
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Aller à la section suivante : ${label}`}
        className="group flex flex-col items-center gap-2 rounded-full border border-primary/30 bg-surface/70 px-5 py-2.5 backdrop-blur-md transition-all duration-300 hover:border-primary hover:bg-surface"
      >
        <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-muted-foreground transition-colors group-hover:text-primary">
          {label}
          <ChevronDown className="h-4 w-4 animate-bounce text-primary" />
        </span>
      </button>
    </div>
  );
};

export default ScrollCue;
