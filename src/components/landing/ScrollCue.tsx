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
    <div className="relative z-20 -mt-8 flex justify-center pb-4">
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Aller à la section suivante : ${label}`}
        className="group flex h-9 w-9 items-center justify-center rounded-full border border-accent/40 bg-surface/70 text-accent backdrop-blur-md transition-all duration-300 hover:border-alert hover:text-alert"
      >
        <ChevronDown className="h-4 w-4 animate-bounce" />
      </button>
    </div>
  );
};

export default ScrollCue;
