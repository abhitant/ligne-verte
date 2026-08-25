import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Filter, ArrowLeft, MapPin, Eye } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { Link } from "react-router-dom";

const ReportsPage = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');
  const { data: reports = [], isLoading } = useReports();

  const filteredReports = reports.filter(report =>
    filter === 'all' || report.status === filter
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'waste': return '🗑️';
      case 'drain': return '🚰';
      default: return '⚠️';
    }
  };

  const filters: { key: typeof filter; label: string; count: number }[] = [
    { key: 'all', label: 'Tous', count: reports.length },
    { key: 'pending', label: 'En attente', count: reports.filter(r => r.status === 'pending').length },
    { key: 'validated', label: 'Validés', count: reports.filter(r => r.status === 'validated').length },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête */}
      <div className="border-b border-border bg-surface/40">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link to="/carte">
            <Button variant="ghost" size="sm" className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-accent hover:bg-accent/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la carte
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="hud-label mb-3">Journal des opérations</p>
              <h1 className="font-display text-3xl md:text-4xl uppercase tracking-tight">
                Tous les <span className="text-accent">signalements</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                Chaque incident capté par la communauté, en accès libre.
              </p>
            </div>
            <div className="hud-panel px-6 py-4 text-center">
              <p className="font-display text-3xl text-accent tabular-nums">{filteredReports.length}</p>
              <p className="hud-meta mt-1">Incidents</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="hud-panel p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <span className="hud-label flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filtres
            </span>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`px-4 py-2 border font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                    filter === f.key
                      ? 'border-accent text-accent bg-accent/10'
                      : 'border-border text-muted-foreground hover:text-accent hover:border-accent/40'
                  }`}
                >
                  {f.label} ({f.count})
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="hud-meta py-12 text-center">Chargement des données…</p>
          ) : filteredReports.length === 0 ? (
            <div className="py-14 text-center">
              <MapPin className="w-10 h-10 mx-auto mb-4 text-accent/60" />
              <p className="font-display uppercase tracking-wide">Aucun signalement</p>
              <p className="hud-meta mt-1">
                {filter !== 'all' ? 'Change de filtre pour élargir la recherche.' : 'En attente des premiers incidents…'}
              </p>
            </div>
          ) : (
            <div className="space-y-px bg-border/60 border border-border/60">
              {filteredReports.map((report) => (
                <article key={report.id} className="bg-card p-5 hover:bg-surface transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getTypeIcon(report.type)}</span>
                      <div>
                        <p className="font-display uppercase tracking-wide text-lg">{report.user}</p>
                        <p className="hud-meta flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {report.location}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 px-3 py-1 border font-mono text-[0.65rem] uppercase tracking-[0.18em] ${
                        report.status === 'validated'
                          ? 'border-signal/60 text-signal'
                          : report.status === 'rejected'
                          ? 'border-critical/60 text-critical'
                          : 'border-alert/60 text-alert'
                      }`}
                    >
                      {report.status === 'validated' ? 'Validé' : report.status === 'rejected' ? 'Rejeté' : 'En attente'}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{report.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border">
                    <span className="hud-meta">
                      {new Date(report.date).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <Link to="/carte">
                      <Button size="sm" variant="ghost" className="font-mono text-xs uppercase tracking-[0.18em] text-accent hover:bg-accent/10">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir sur la carte
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
