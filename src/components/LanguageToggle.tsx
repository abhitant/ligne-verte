import { useI18n } from "@/i18n/LanguageContext";

interface Props {
  className?: string;
}

const LanguageToggle = ({ className = "" }: Props) => {
  const { lang, setLang } = useI18n();

  return (
    <div
      className={`inline-flex items-center border border-border font-mono text-[0.65rem] uppercase tracking-[0.18em] ${className}`}
      role="group"
      aria-label="Language / Langue"
    >
      {(["fr", "en"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2 py-1 transition-colors ${
            lang === l
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-accent"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
};

export default LanguageToggle;
