import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Sprout, Package } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { Progress } from "@/components/ui/progress";

export default function Analytics() {
  const t = useTranslation();

  const cropYields = [
    { name: "Rice", yield: 4.2, target: 5.0, unit: "tons/hectare", trend: "up" },
    { name: "Wheat", yield: 3.8, target: 4.5, unit: "tons/hectare", trend: "up" },
    { name: "Cotton", yield: 2.1, target: 2.5, unit: "tons/hectare", trend: "down" },
    { name: "Tomato", yield: 35.5, target: 40.0, unit: "tons/hectare", trend: "up" }
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000 },
    { month: "Feb", revenue: 52000 },
    { month: "Mar", revenue: 48000 },
    { month: "Apr", revenue: 61000 },
    { month: "May", revenue: 58000 },
    { month: "Jun", revenue: 72000 }
  ];

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const avgRevenue = Math.round(totalRevenue / revenueData.length);
  const revenueGrowth = ((revenueData[revenueData.length - 1].revenue - revenueData[0].revenue) / revenueData[0].revenue * 100).toFixed(1);

  const seasonalMetrics = {
    cropsDiversity: 6,
    landUtilization: 87,
    waterEfficiency: 76,
    profitMargin: 42
  };

  return (
    <div className="flex-1 pb-20 bg-background">
      <div className="p-4 space-y-4">
        <div className="flex items-center mb-4">
          <BarChart3 className="h-8 w-8 text-farmer-green mr-3" />
          <div>
            <h1 className="text-2xl font-bold text-farmer-green">{t.analytics}</h1>
            <p className="text-sm text-gray-600">Track your farming performance</p>
          </div>
        </div>

        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-farmer-green">
              <DollarSign className="h-5 w-5 mr-2" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-farmer-green">₹{(totalRevenue / 1000).toFixed(0)}K</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Avg Monthly</p>
                <p className="text-2xl font-bold text-blue-600">₹{(avgRevenue / 1000).toFixed(0)}K</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-green-100 p-3 rounded-lg">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-700">Growth: +{revenueGrowth}%</span>
              </div>
              <span className="text-sm text-green-600">Last 6 months</span>
            </div>
            
            {/* Simple bar chart */}
            <div className="mt-4 flex items-end justify-between h-32 gap-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-farmer-green rounded-t transition-all hover:bg-green-600"
                    style={{ height: `${(item.revenue / Math.max(...revenueData.map(d => d.revenue))) * 100}%` }}
                  />
                  <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crop Yield Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-farmer-green">
              <Sprout className="h-5 w-5 mr-2" />
              Crop Yield Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cropYields.map((crop, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{crop.name}</span>
                    {crop.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-600">
                    {crop.yield}/{crop.target} {crop.unit}
                  </span>
                </div>
                <Progress value={(crop.yield / crop.target) * 100} className="h-2" />
                <p className="text-xs text-gray-500">
                  {((crop.yield / crop.target) * 100).toFixed(0)}% of target achieved
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Seasonal Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-farmer-green">
              <Package className="h-5 w-5 mr-2" />
              Seasonal Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600 mb-1">Crops Diversity</p>
                <p className="text-3xl font-bold text-farmer-green">{seasonalMetrics.cropsDiversity}</p>
                <p className="text-xs text-gray-500 mt-1">Different crops</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Land Utilization</p>
                <p className="text-3xl font-bold text-blue-600">{seasonalMetrics.landUtilization}%</p>
                <p className="text-xs text-gray-500 mt-1">Of total land</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
                <p className="text-sm text-gray-600 mb-1">Water Efficiency</p>
                <p className="text-3xl font-bold text-cyan-600">{seasonalMetrics.waterEfficiency}%</p>
                <p className="text-xs text-gray-500 mt-1">Resource usage</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
                <p className="text-sm text-gray-600 mb-1">Profit Margin</p>
                <p className="text-3xl font-bold text-emerald-600">{seasonalMetrics.profitMargin}%</p>
                <p className="text-xs text-gray-500 mt-1">Net profit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="bg-gradient-to-r from-farmer-green to-green-600 text-white">
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-2">💡 Key Insights</h3>
            <ul className="space-y-2 text-sm">
              <li>• Rice yield is 84% of target - consider soil testing</li>
              <li>• Revenue growth of {revenueGrowth}% - excellent progress!</li>
              <li>• Cotton performance needs attention</li>
              <li>• Water efficiency can be improved by 24%</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
