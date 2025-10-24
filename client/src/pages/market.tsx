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

  const { data: allCrops = [] } = useQuery({
    queryKey: ["/api/crops"],
  });

  const { data: marketPricesData = [] } = useQuery({
    queryKey: ["/api/market-prices"],
  });

  const marketPrices = marketPricesData.map((price: any) => {
    const crop = allCrops.find((c: any) => c._id === price.cropId);
    return {
      ...price,
      crop: crop?.name || "Unknown", // Added null check for crop name
      priceChange: price.priceChange || 0
    };
  });

  const filteredPrices = marketPrices.filter((price: any) => 
    price.crop && price.crop.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleListenPrice = (price: any) => {
    const change = price.priceChange > 0 ? `up ${price.priceChange}` : `down ${Math.abs(price.priceChange)}`;
    speak(`${price.crop} is currently at ${price.price} rupees per quintal, ${change} percent`);
  };

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
      </header>

      <div className="p-4 pb-20">
        {/* Search Bar */}
        {showSearch && (
          <div className="mb-4">
            <Input
              type="text"
              placeholder="Search crops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        )}

        {/* AI-Powered Insights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-farmer-green flex items-center">
              <Lightbulb className="mr-2 h-5 w-5" />
              AI Market Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    insight.color === 'blue' ? 'bg-blue-50 border-l-4 border-blue-500' :
                    'bg-yellow-50 border-l-4 border-yellow-500'
                  }`}
                >
                  <div className="flex items-start">
                    <insight.icon className={`h-5 w-5 mr-2 ${
                      insight.color === 'blue' ? 'text-blue-600' : 'text-yellow-600'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{insight.crop}</p>
                      <p className="text-xs text-gray-700">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Prices */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-farmer-green">Today's Prices</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPrices.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No market prices available</p>
              ) : (
                filteredPrices.map((price: any) => (
                  <div key={price._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <p className="font-medium">{price.crop}</p>
                      <p className="text-sm text-gray-600">{price.market}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-lg font-bold text-farmer-green">
                        ₹{price.price.toLocaleString()}/quintal
                      </p>
                      <div className="flex items-center justify-end">
                        {price.priceChange > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm ${price.priceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.abs(price.priceChange)}%
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleListenPrice(price)}
                      className="text-farmer-green"
                    >
                      <Volume2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>

            <Button className="w-full mt-4 bg-farmer-green text-white hover:bg-farmer-green-light" onClick={() => setLocation("/sell-direct")}>
              <Search className="mr-2 h-4 w-4" />
              Sell Direct
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}