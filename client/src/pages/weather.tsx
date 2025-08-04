import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CloudRain, Sun, Cloud, Volume2, AlertTriangle } from "lucide-react";
import { useLocation } from "wouter";
import { useVoice } from "@/hooks/use-voice";

export default function Weather() {
  const [, setLocation] = useLocation();
  const { speak } = useVoice();

  const currentWeather = {
    location: "Hyderabad",
    date: "Today, March 15",
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: 12,
    uvIndex: 6
  };

  const forecast = [
    {
      day: "Tomorrow",
      icon: CloudRain,
      condition: "Heavy rain expected",
      high: 24,
      low: 18,
      rain: 90,
      color: "text-blue-500"
    },
    {
      day: "Sunday",
      icon: Sun,
      condition: "Sunny",
      high: 32,
      low: 22,
      rain: 0,
      color: "text-yellow-500"
    },
    {
      day: "Monday",
      icon: Cloud,
      condition: "Cloudy",
      high: 29,
      low: 20,
      rain: 20,
      color: "text-gray-500"
    }
  ];

  const handleListenAlert = () => {
    speak("Heavy rain alert: Expected tomorrow 6 PM to 10 PM. Protect your crops and ensure proper drainage.");
  };

  const handleListenForecast = () => {
    const forecastText = forecast.map(day => 
      `${day.day}: ${day.condition}, high ${day.high} degrees, low ${day.low} degrees, ${day.rain}% chance of rain`
    ).join('. ');
    speak(`7-day weather forecast: ${forecastText}`);
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
        <h1 className="text-xl font-bold">Weather Forecast</h1>
      </header>

      <div className="p-4 pb-20">
        {/* Current Weather */}
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold">{currentWeather.location}</h2>
                <p className="opacity-90">{currentWeather.date}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{currentWeather.temperature}°C</div>
                <p className="opacity-90">{currentWeather.condition}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="opacity-90 text-sm">Humidity</p>
                <p className="font-bold">{currentWeather.humidity}%</p>
              </div>
              <div>
                <p className="opacity-90 text-sm">Wind</p>
                <p className="font-bold">{currentWeather.wind} km/h</p>
              </div>
              <div>
                <p className="opacity-90 text-sm">UV Index</p>
                <p className="font-bold">{currentWeather.uvIndex} High</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Alert */}
        <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
              <div>
                <p className="font-bold text-red-800">Heavy Rain Alert</p>
                <p className="text-red-700">Expected tomorrow 6 PM - 10 PM</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleListenAlert}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-farmer-green">7-Day Forecast</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleListenForecast}
              className="border-farmer-green text-farmer-green hover:bg-farmer-green hover:text-white"
            >
              <Volume2 className="h-4 w-4 mr-2" />
              Listen
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecast.map((day, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <day.icon className={`h-6 w-6 mr-3 ${day.color}`} />
                    <div>
                      <p className="font-medium">{day.day}</p>
                      <p className="text-sm text-gray-600">{day.condition}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{day.high}°/{day.low}°</p>
                    <p className={`text-sm ${day.rain > 50 ? 'text-blue-600' : day.rain > 0 ? 'text-gray-600' : 'text-green-600'}`}>
                      {day.rain}% rain
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Farming Recommendations */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-bold text-green-800 mb-2">Farming Recommendations:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Postpone pesticide application due to rain</li>
                <li>• Ensure proper drainage in fields</li>
                <li>• Harvest ready crops before rain</li>
                <li>• Cover stored crops and equipment</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
