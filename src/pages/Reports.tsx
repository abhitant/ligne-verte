import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, ArrowLeft, MapPin, Eye } from "lucide-react";
import { useReports } from "@/hooks/useReports";
import { Link } from "react-router-dom";

const ReportsPage = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'validated'>('all');
  const { data: reports = [], isLoading } = useReports();

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validated': return 'bg-green-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'waste': return '🗑️';
      case 'drain': return '🚰';
      default: return '⚠️';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary shadow-lg p-4 border-b border-primary/20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/map">
              <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la carte
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-1">📋 Tous les Signalements</h1>
              <p className="text-primary-foreground/90">Explorez tous les signalements de la communauté</p>
            </div>
            <div className="bg-accent rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-accent-foreground">{filteredReports.length}</div>
              <div className="text-xs text-accent-foreground/80">Signalements</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Card className="bg-primary text-primary-foreground border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-primary-foreground text-xl">
                  <Filter className="w-6 h-6 text-accent" />
                  Liste des Signalements
                </CardTitle>
                <CardDescription className="text-primary-foreground/80">
                  Filtrez et explorez tous les signalements
                </CardDescription>
              </div>
              
              {/* Filtres */}
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={`text-sm bg-accent text-accent-foreground hover:bg-accent/80 ${filter === 'all' ? 'ring-2 ring-accent-foreground' : ''}`}
                >
                  Tous ({reports.length})
                </Button>
                <Button
                  size="sm"
                  onClick={() => setFilter('pending')}
                  className={`text-sm bg-accent text-accent-foreground hover:bg-accent/80 ${filter === 'pending' ? 'ring-2 ring-accent-foreground' : ''}`}
                >
                  En attente ({reports.filter(r => r.status === 'pending').length})
                </Button>
                <Button
                  size="sm"
                  onClick={() => setFilter('validated')}
                  className={`text-sm bg-accent text-accent-foreground hover:bg-accent/80 ${filter === 'validated' ? 'ring-2 ring-accent-foreground' : ''}`}
                >
                  Validés ({reports.filter(r => r.status === 'validated').length})
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-primary-foreground/80">Chargement des signalements...</p>
              </div>
            ) : filteredReports.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-accent" />
                <p className="text-primary-foreground font-medium">Aucun signalement trouvé</p>
                <p className="text-primary-foreground/80 mt-2">
                  {filter !== 'all' ? 'Essayez de changer le filtre.' : 'En attente des premiers signalements...'}
                </p>
                {reports.length > 0 && filter !== 'all' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-4 bg-accent text-accent-foreground hover:bg-accent/80"
                    onClick={() => setFilter('all')}
                  >
                    Voir tous les signalements
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredReports.map((report) => (
                  <div 
                    key={report.id}
                    className="p-4 rounded-lg transition-all hover:shadow-md bg-accent text-accent-foreground hover:bg-accent/80"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(report.type)}</span>
                        <div>
                          <p className="font-semibold text-accent-foreground text-lg">{report.user}</p>
                          <p className="text-sm text-accent-foreground/80 flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {report.location}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${getStatusColor(report.status)}`}></div>
                        <Badge variant="secondary" className="bg-accent-foreground text-accent">
                          {report.status === 'validated' ? 'Validé' : 
                           report.status === 'rejected' ? 'Rejeté' : 'En attente'}
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-accent-foreground/80 mb-4 leading-relaxed">{report.description}</p>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-accent-foreground/20">
                      <span className="text-sm text-accent-foreground/80">
                        Signalé le {new Date(report.date).toLocaleDateString('fr-FR', { 
                          day: '2-digit', 
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      <Button size="sm" variant="ghost" className="bg-accent-foreground text-accent hover:bg-accent-foreground/80">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir sur la carte
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;