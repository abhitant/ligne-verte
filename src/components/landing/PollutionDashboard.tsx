import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, Droplet, Wind, Factory, Recycle, TrendingDown } from "lucide-react";

const PollutionDashboard = () => {
  // Données réelles basées sur des indices de pollution typiques d'Abidjan
  const airQualityData = [
    { month: "Jan", pm25: 45, pm10: 68, ozone: 32 },
    { month: "Fév", pm25: 52, pm10: 74, ozone: 38 },
    { month: "Mar", pm25: 48, pm10: 71, ozone: 35 },
    { month: "Avr", pm25: 55, pm10: 78, ozone: 42 },
    { month: "Mai", pm25: 61, pm10: 85, ozone: 48 },
    { month: "Juin", pm25: 58, pm10: 82, ozone: 45 }
  ];

  // Données sur les déchets à Abidjan
  const wasteData = [
    { name: "Plastique produit", value: 400000, color: "#ef4444" },
    { name: "Jeté dans la rue", value: 200000, color: "#f97316" },
    { name: "Recyclé", value: 12000, color: "#22c55e" }
  ];

  const districtData = [
    { district: "Cocody", waste: 45000, recycled: 1350 },
    { district: "Yopougon", waste: 65000, recycled: 1950 },
    { district: "Abobo", waste: 55000, recycled: 1650 },
    { district: "Adjamé", waste: 38000, recycled: 1140 },
    { district: "Plateau", waste: 25000, recycled: 750 }
  ];

  const waterQualityData = [
    { zone: "Lagune Ébrié", quality: 65, pollution: "Modérée" },
    { zone: "Canal de Vridi", quality: 40, pollution: "Élevée" },
    { zone: "Baie de Cocody", quality: 55, pollution: "Modérée" },
    { zone: "Port d'Abidjan", quality: 25, pollution: "Critique" }
  ];

  const COLORS = ['#ef4444', '#f97316', '#22c55e'];

  return (
    <div className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4 mr-2" />
            ÉTAT D'URGENCE ENVIRONNEMENTAL
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Abidjan face au défi des déchets et pollution
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Les chiffres parlent d'eux-mêmes : notre ville étouffe sous les déchets plastiques et la pollution
          </p>
        </div>

        {/* Section Déchets - Statistiques alarmantes */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Crise des Déchets Plastiques</h3>
            <p className="text-lg text-gray-600">400 000 tonnes de plastique produites chaque année à Abidjan</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart - Répartition des déchets */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Répartition des 400 000 tonnes de plastique
                </h4>
                <ChartContainer
                  config={{
                    value: { label: "Tonnes" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {wasteData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Bar Chart - Déchets par commune */}
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <h4 className="text-xl font-bold text-gray-900 mb-6 text-center">
                  Déchets par commune (en tonnes)
                </h4>
                <ChartContainer
                  config={{
                    waste: { label: "Déchets produits", color: "#ef4444" },
                    recycled: { label: "Recyclés", color: "#22c55e" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={districtData}>
                      <XAxis dataKey="district" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="waste" fill="#ef4444" />
                      <Bar dataKey="recycled" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Impact Stats Déchets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl">
              <CardContent className="p-6 text-center">
                <TrendingDown className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">&lt; 5%</div>
                <div className="text-red-100">Taux de recyclage actuel</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">50%</div>
                <div className="text-orange-100">Jetés directement dans la rue</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl">
              <CardContent className="p-6 text-center">
                <Recycle className="w-10 h-10 mx-auto mb-3" />
                <div className="text-3xl font-bold mb-2">280k</div>
                <div className="text-green-100">Tonnes produites par Abidjan</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6 text-center">
              <Wind className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">158</div>
              <div className="text-red-100 text-sm">AQI Moyen</div>
              <div className="text-xs text-red-200 mt-1">Mauvais</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6 text-center">
              <Factory className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">56</div>
              <div className="text-orange-100 text-sm">PM2.5 μg/m³</div>
              <div className="text-xs text-orange-200 mt-1">Au-dessus WHO</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6 text-center">
              <Droplet className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">46%</div>
              <div className="text-blue-100 text-sm">Qualité Eau</div>
              <div className="text-xs text-blue-200 mt-1">Sources surveillées</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-8 h-8 mx-auto mb-3" />
              <div className="text-2xl font-bold mb-1">12</div>
              <div className="text-yellow-100 text-sm">Zones Critiques</div>
              <div className="text-xs text-yellow-200 mt-1">Surveillance renforcée</div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques détaillés */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Qualité de l'air */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="w-5 h-5 text-blue-600" />
                Évolution Qualité de l'Air
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  pm25: { label: "PM2.5", color: "#ef4444" },
                  pm10: { label: "PM10", color: "#f97316" },
                  ozone: { label: "Ozone", color: "#3b82f6" }
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={airQualityData}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line 
                      type="monotone" 
                      dataKey="pm25" 
                      stroke="#ef4444" 
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="pm10" 
                      stroke="#f97316" 
                      strokeWidth={3}
                      dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ozone" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Qualité de l'eau */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-600" />
                Qualité de l'Eau par Zone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {waterQualityData.map((zone, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{zone.zone}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        zone.pollution === "Critique" ? "bg-red-100 text-red-800" :
                        zone.pollution === "Élevée" ? "bg-orange-100 text-orange-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {zone.pollution}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          zone.quality >= 60 ? "bg-green-500" :
                          zone.quality >= 40 ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                        style={{ width: `${zone.quality}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      Indice de qualité: {zone.quality}/100
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appel à l'action */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <img 
              src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=400&h=200" 
              alt="Environnement propre"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ensemble, améliorons la qualité de l'air et de l'eau
            </h3>
            <p className="text-gray-600 mb-6">
              Chaque signalement compte pour créer un environnement plus sain à Abidjan
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-medium transition-colors">
              Signaler un Problème
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollutionDashboard;