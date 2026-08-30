import DeboraSay from "@/components/landing/DeboraSay";
import ReportsCarousel from "@/components/landing/ReportsCarousel";



const WasteProblemSection = () => {
  return (
    <section id="categories" className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 hud-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Texte + Déborah */}
          <div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase leading-tight">
              Nos quartiers{" "}
              <span className="text-accent">croulent</span>{" "}
              sous la menace.
            </h2>

            <DeboraSay
              className="mt-8"
              pose="alert"
              face="right"
              line="« Incivisme, salubrité, voirie, éclairage… Chaque jour, des problèmes s'accumulent dans nos rues. Si on ne les voit pas, on ne les règle pas. C'est pour ça que La Ligne Verte existe, pour les repérer, les cartographier et les résoudre ensemble. »"
              cta={{ label: "Les signalements", to: "/signalements" }}
            />
          </div>

          {/* Carrousel des signalements reçus */}
          <ReportsCarousel />
        </div>

      </div>
    </section>
  );
};

export default WasteProblemSection;