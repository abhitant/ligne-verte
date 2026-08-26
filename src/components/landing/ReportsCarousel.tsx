import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface ReportPhoto {
  id: string;
  photo_url: string;
  reporter_pseudo: string | null;
  waste_type: string | null;
  waste_category: string | null;
  created_at: string | null;
}

const ReportsCarousel = () => {
  const [reports, setReports] = useState<ReportPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const { data } = await supabase
        .from("reports_public")
        .select("id, photo_url, reporter_pseudo, waste_type, waste_category, created_at")
        .not("photo_url", "is", null)
        .neq("status", "rejected")
        .order("created_at", { ascending: false })
        .limit(24);
      if (!active) return;
      const isWaste = (s: string) => {
        const t = s.toLowerCase();
        return (
          t.includes("déchet") ||
          t.includes("dépôt") ||
          t.includes("décharge") ||
          t.includes("waste") ||
          t.includes("ordure") ||
          t.includes("plastique") ||
          t.includes("canette") ||
          t.includes("verre") ||
          t.includes("ferraille") ||
          t.includes("construction")
        );
      };
      const wasteOnly = (data ?? [])
        .filter((r) => !!r.photo_url)
        .filter(
          (r) =>
            isWaste(r.waste_type ?? "") || isWaste(r.waste_category ?? "")
        )
        .slice(0, 12) as ReportPhoto[];
      setReports(wasteOnly);
      setLoading(false);
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="hud-panel p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="hud-label">Signalements reçus</span>
        <span className="hud-meta">LIVE</span>
      </div>

      {loading ? (
        <div className="aspect-[4/3] w-full bg-surface/60 border border-border/70 animate-pulse" />
      ) : reports.length === 0 ? (
        <div className="aspect-[4/3] w-full bg-surface/60 border border-border/70 flex items-center justify-center text-sm text-muted-foreground">
          Aucun signalement pour le moment.
        </div>
      ) : (
        <Carousel
          opts={{ loop: true, align: "start" }}
          plugins={[Autoplay({ delay: 3500, stopOnInteraction: false })]}
          className="relative"
        >
          <CarouselContent>
            {reports.map((report, index) => (
              <CarouselItem key={report.id}>
                <div className="relative aspect-[4/3] overflow-hidden border border-border/70 bg-surface/60">
                  <img
                    src={report.photo_url}
                    alt={`Signalement citoyen ${report.waste_type ?? ""} ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-card/85 border-t border-border/60 px-3 py-2 flex items-center justify-between gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-accent truncate max-w-[45%]">
                      reçu de {report.reporter_pseudo || "habitant"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate text-right">
                      {report.waste_type || report.waste_category || "Signalement citoyen"}
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      )}

      <p className="mt-4 text-sm text-muted-foreground italic">
        « Tout ce qui gâte le quartier, envoie-le-moi. Je le transforme en donnée ouverte et localisée. »
      </p>
    </div>
  );
};

export default ReportsCarousel;
