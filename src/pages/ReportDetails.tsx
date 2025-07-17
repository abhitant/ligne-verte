import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Calendar, User, FileText, Camera, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ReportDetails {
  id: string;
  user_telegram_id: string;
  photo_url: string | null;
  description: string | null;
  location_lat: number;
  location_lng: number;
  status: string | null;
  created_at: string | null;
  waste_type: string | null;
  brand: string | null;
  severity_level: number | null;
  points_awarded: number | null;
  is_cleaned: boolean | null;
  cleanup_photo_url: string | null;
  user?: {
    pseudo: string | null;
    points_himpact: number | null;
  };
}

const ReportDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<ReportDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        
        // Récupérer les détails du signalement
        const { data: reportData, error: reportError } = await supabase
          .from('reports')
          .select('*')
          .eq('id', id)
          .single();

        if (reportError) {
          console.error('Error fetching report:', reportError);
          setError('Signalement non trouvé');
          return;
        }

        // Récupérer les informations de l'utilisateur
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('pseudo, points_himpact')
          .eq('telegram_id', reportData.user_telegram_id)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
        }

        setReport({
          ...reportData,
          user: userData || { pseudo: null, points_himpact: null }
        });

      } catch (err) {
        console.error('Error:', err);
        setError('Erreur lors du chargement du signalement');
      } finally {
        setLoading(false);
      }
    };

    fetchReportDetails();
  }, [id]);

  const getStatusInfo = (status: string | null) => {
    switch (status) {
      case 'validated':
        return {
          color: 'bg-green-500',
          icon: CheckCircle,
          text: 'Validé',
          className: 'text-green-700 bg-green-100'
        };
      case 'rejected':
        return {
          color: 'bg-red-500',
          icon: XCircle,
          text: 'Rejeté',
          className: 'text-red-700 bg-red-100'
        };
      default:
        return {
          color: 'bg-yellow-500',
          icon: Clock,
          text: 'En attente',
          className: 'text-yellow-700 bg-yellow-100'
        };
    }
  };

  const formatLocation = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => navigate('/map')}
            className="mb-6 bg-green-600 hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la carte
          </Button>
          
          <Card className="bg-card shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-red-600">
                <XCircle className="w-12 h-12 mx-auto mb-4" />
                <h1 className="text-xl font-bold mb-2">Signalement non trouvé</h1>
                <p className="text-gray-600">{error || 'Le signalement demandé n\'existe pas.'}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(report.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={() => navigate('/map')}
          className="mb-6 bg-green-600 hover:bg-green-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la carte
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Carte principale avec détails */}
          <div className="lg:col-span-2">
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-green-800 mb-2">
                      Détails du signalement
                    </CardTitle>
                    <CardDescription>
                      Signalé le {report.created_at ? new Date(report.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : 'Date inconnue'}
                    </CardDescription>
                  </div>
                  <Badge className={statusInfo.className}>
                    <StatusIcon className="w-4 h-4 mr-1" />
                    {statusInfo.text}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Photo du signalement */}
                {report.photo_url && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Photo du signalement
                    </h3>
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <img
                        src={report.photo_url}
                        alt="Photo du signalement"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Description */}
                {report.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Description
                    </h3>
                    <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                      {report.description}
                    </p>
                  </div>
                )}

                {/* Localisation */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    Localisation
                  </h3>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800 font-mono text-sm">
                      📍 {formatLocation(report.location_lat, report.location_lng)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        const url = `https://www.openstreetmap.org/?mlat=${report.location_lat}&mlon=${report.location_lng}&zoom=16`;
                        window.open(url, '_blank');
                      }}
                    >
                      Voir sur OpenStreetMap
                    </Button>
                  </div>
                </div>

                {/* Photo de nettoyage si disponible */}
                {report.cleanup_photo_url && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Photo après nettoyage
                    </h3>
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <img
                        src={report.cleanup_photo_url}
                        alt="Photo après nettoyage"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar avec informations complémentaires */}
          <div className="space-y-6">
            {/* Informations utilisateur */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Pseudo</p>
                    <p className="font-semibold">
                      {report.user?.pseudo || `Utilisateur ${report.user_telegram_id.slice(-4)}`}
                    </p>
                  </div>
                  {report.user?.points_himpact !== null && (
                    <div>
                      <p className="text-sm text-gray-600">Points Himpact</p>
                      <p className="font-semibold text-green-600">
                        {report.user.points_himpact} points
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Détails techniques */}
            <Card className="bg-card shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-green-800">
                  Informations techniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">ID du signalement</p>
                    <p className="font-mono text-xs break-all">{report.id}</p>
                  </div>
                  
                  {report.waste_type && (
                    <div>
                      <p className="text-gray-600">Type de déchet</p>
                      <p className="font-semibold">{report.waste_type}</p>
                    </div>
                  )}

                  {report.brand && (
                    <div>
                      <p className="text-gray-600">Marque identifiée</p>
                      <p className="font-semibold">{report.brand}</p>
                    </div>
                  )}

                  {report.severity_level && (
                    <div>
                      <p className="text-gray-600">Niveau de gravité</p>
                      <div className="flex items-center">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`w-3 h-3 rounded-full mr-1 ${
                                level <= report.severity_level! ? 'bg-red-500' : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm">
                          {report.severity_level}/5
                        </span>
                      </div>
                    </div>
                  )}

                  {report.points_awarded !== null && report.points_awarded > 0 && (
                    <div>
                      <p className="text-gray-600">Points attribués</p>
                      <p className="font-semibold text-green-600">
                        +{report.points_awarded} points
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-600">Statut de nettoyage</p>
                    <p className="font-semibold">
                      {report.is_cleaned ? 'Nettoyé ✅' : 'Non nettoyé ❌'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetails;