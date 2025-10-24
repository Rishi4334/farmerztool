import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, TrendingUp, TrendingDown, Search, Volume2, Lightbulb, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useVoice } from "@/hooks/use-voice";
import { useQuery } from "@tanstack/react-query";

export default function Market() {
  const [, setLocation] = useLocation();
  const { speak } = useVoice();
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const { data: allCrops } = useQuery({
    queryKey: ["/api/crops"],
  });

  const { data: marketPricesData } = useQuery({
    queryKey: ["/api/market-prices"],
  });

  

  const insights = [
    {
      type: "sell",
      crop: "Tomato",
      message: "Sell now, prices peaking due to supply shortage",
      icon: Lightbulb,
      color: "blue"
    },
    {
      type: "wait",
      crop: "Rice",
      message: "Hold for 1 week, prices expected to rise 8%",
      icon: Clock,
      color: "yellow"
    }
  ];

  const handleListenUpdate = () => {
    const updateText = `Market update: Rice prices up 2.1% to ₹2,450 per quintal. Tomato prices surged 4.9% to ₹3,200. Wheat declined 0.9% to ₹2,180. Recommendation: Sell tomatoes now due to high demand, hold rice for better prices next week.`;
    speak(updateText);
  };

  const handleListenPrediction = () => {
    speak("AI Price Prediction: Rice prices are expected to rise by 8% next week due to increased demand and reduced supply from neighboring states.");
  };

  // Combine crops data with market prices
  const cropsWithPrices = (allCrops || []).map((crop: any) => {
    const marketPrice = (marketPricesData || []).find((mp: any) => mp.cropId === crop._id);
    return {
      _id: crop._id,
      name: crop.name,
      price: marketPrice?.price || crop.currentPrice || 2000,
      change: marketPrice?.priceChange || 0,
      changePercent: marketPrice?.priceChange ? ((marketPrice.priceChange / marketPrice.price) * 100).toFixed(1) : 0,
      trend: (marketPrice?.priceChange || 0) > 0 ? "up" : "down",
      image: crop.category === 'Grain' ? "🌾" : crop.category === 'Vegetable' ? "🥬" : "🌱"
    };
  });

  const filteredCrops = cropsWithPrices.filter((crop) =>
    crop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-farmer-green text-white p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/")}
          className="mr-3 text-white hover:bg-farmer-green-light"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold">Market Prices</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSearch(!showSearch)}
          className="ml-auto text-white hover:bg-farmer-green-light"
        >
          <Search className="h-6 w-6" />
        </Button>
      </header>

      {showSearch && (
        <div className="p-4 bg-farmer-green-light">
          <Input
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white text-farmer-green focus:ring-farmer-green"
          />
        </div>
      )}

      <div className="p-4 pb-20">
        {/* AI Price Prediction Banner */}
        <Card className="bg-gradient-to-r from-farmer-orange to-yellow-500 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 mr-4" />
                <div>
                  <h3 className="font-bold text-lg">AI Price Prediction</h3>
                  <p className="opacity-90">Rice prices expected to rise 8% next week</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleListenPrediction}
                className="text-white hover:bg-white/20"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Current Market Prices */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-farmer-green">Today's Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCrops.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="text-2xl mr-4">{crop.image}</div>
                    <div>
                      <p className="font-medium">{crop.name}</p>
                      <p className="text-sm text-gray-600">Per quintal</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{crop.price.toLocaleString()}</p>
                    <div className="flex items-center">
                      {crop.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <p className={`text-sm ${crop.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {crop.change > 0 ? "+" : ""}{crop.change} ({crop.changePercent > 0 ? "+" : ""}{crop.changePercent}%)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4 bg-farmer-green text-white hover:bg-farmer-green-light" onClick={() => setLocation("/sell-direct")}>
              <Search className="mr-2 h-4 w-4" />
              Sell Direct
            </Button>
          </CardContent>
        </Card>

        {/* Market Insights */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-farmer-green">Market Insights</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleListenUpdate}
              className="border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Listen
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  insight.color === 'blue' ? 'bg-blue-50' : 'bg-yellow-50'
                }`}>
                  <div className="flex items-start">
                    <insight.icon className={`h-5 w-5 mt-1 mr-3 ${
                      insight.color === 'blue' ? 'text-blue-500' : 'text-yellow-500'
                    }`} />
                    <div>
                      <div className="flex items-center mb-1">
                        <p className={`font-medium ${
                          insight.color === 'blue' ? 'text-blue-800' : 'text-yellow-800'
                        }`}>
                          {insight.type === 'sell' ? 'Best Selling Time' : 'Wait Strategy'}
                        </p>
                        <Badge variant="outline" className="ml-2">
                          {insight.crop}
                        </Badge>
                      </div>
                      <p className={`text-sm ${
                        insight.color === 'blue' ? 'text-blue-700' : 'text-yellow-700'
                      }`}>
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Additional Market Trends */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-3 bg-green-50 rounded-lg text-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-800">Rising Demand</p>
                  <p className="text-xs text-green-600">Vegetables</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg text-center">
                  <TrendingDown className="h-6 w-6 text-red-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-red-800">Oversupply</p>
                  <p className="text-xs text-red-600">Cereals</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}