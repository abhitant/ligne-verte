
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { AlertTriangle, TrendingDown, Recycle } from "lucide-react";

const EnvironmentalStats = () => {
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

  const COLORS = ['#ef4444', '#f97316', '#22c55e'];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <AlertTriangle className="w-4 h-4 mr-2" />
            ÉTAT D'URGENCE ENVIRONNEMENTAL
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Abidjan face au défi des déchets
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Les chiffres parlent d'eux-mêmes : notre ville étouffe sous les déchets plastiques
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Pie Chart - Waste Distribution */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Répartition des 400 000 tonnes de plastique
              </h3>
              <ChartContainer
                config={{
                  value: {
                    label: "Tonnes",
                  },
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

          {/* Bar Chart - District Comparison */}
          <Card className="shadow-xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Déchets par commune (en tonnes)
              </h3>
              <ChartContainer
                config={{
                  waste: {
                    label: "Déchets produits",
                    color: "#ef4444",
                  },
                  recycled: {
                    label: "Recyclés",
                    color: "#22c55e",
                  },
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

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <TrendingDown className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">&lt; 5%</div>
              <div className="text-red-100">Taux de recyclage actuel</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">50%</div>
              <div className="text-orange-100">Jetés directement dans la rue</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-xl">
            <CardContent className="p-8 text-center">
              <Recycle className="w-12 h-12 mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">280k</div>
              <div className="text-green-100">Tonnes produites par Abidjan</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalStats;
