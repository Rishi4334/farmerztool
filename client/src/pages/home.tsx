import { Card, CardContent } from "@/components/ui/card";
import { CloudSun, ChartLine, Store, GraduationCap, UserCheck, Camera } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/use-language";
import { WeatherAlert } from "@/components/weather-alert";

export default function Home() {
  const [, setLocation] = useLocation();
  const t = useTranslation();
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const features = [
    {
      icon: Camera,
      title: t.plantDoctor,
      subtitle: "AI-powered disease detection",
      path: "/plant-doctor",
      color: "text-green-500"
    },
    {
      icon: CloudSun,
      title: t.weather,
      subtitle: "Forecasts & alerts",
      path: "/weather",
      color: "text-blue-500"
    },
    {
      icon: ChartLine,
      title: t.market,
      subtitle: "Prices & predictions",
      path: "/market",
      color: "text-green-500"
    },
    {
      icon: Store,
      title: t.sellDirect,
      subtitle: "Skip middlemen",
      path: "/sell-direct",
      color: "text-farmer-orange"
    },
    {
      icon: GraduationCap,
      title: t.learn,
      subtitle: "Tips & tutorials",
      path: "/knowledge-hub",
      color: "text-purple-500"
    },
    {
      icon: UserCheck,
      title: t.expertHelp,
      subtitle: "Chat with agronomists",
      path: "/expert-connect",
      color: "text-red-500"
    }
  ];

  return (
    <div className="flex-1 pb-20 bg-background">
      {/* Welcome Message */}
      {user && (
        <div className="bg-gradient-to-r from-farmer-green to-green-600 text-white p-6 mb-4">
          <h2 className="text-2xl font-bold">Welcome back, {user.username}! 🌾</h2>
          <p className="text-green-50 mt-1">Let's make today productive</p>
        </div>
      )}

      {/* Weather Alert */}
      <WeatherAlert 
        alertType="rain"
        message="Heavy rain expected tomorrow. Protect your crops!"
        severity="high"
      />

      {/* Main Navigation Grid */}
      <div className="grid grid-cols-2 gap-4 p-4">
        {features.map((feature) => (
          <Card
            key={feature.path}
            onClick={() => setLocation(feature.path)}
            className="cursor-pointer border-2 border-transparent hover:border-farmer-green transition-all duration-200 touch-button"
          >
            <CardContent className="p-6 text-center">
              <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
              <h3 className="font-bold text-farmer-green mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.subtitle}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-farmer-green mb-4">{t.recentActivity}</h2>
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Camera className="h-5 w-5 text-farmer-green mr-3" />
                <div>
                  <p className="font-medium">Tomato leaf analyzed</p>
                  <p className="text-sm text-gray-600">2 hours ago - Early blight detected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center">
                <Store className="h-5 w-5 text-farmer-orange mr-3" />
                <div>
                  <p className="font-medium">Rice order received</p>
                  <p className="text-sm text-gray-600">Yesterday - ₹2,400/quintal</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
