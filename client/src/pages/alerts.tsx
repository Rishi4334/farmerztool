import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, CloudRain, TrendingUp, Bug, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export default function Alerts() {
  const t = useTranslation();
  const [weatherNotifs, setWeatherNotifs] = useState(true);
  const [priceNotifs, setPriceNotifs] = useState(true);
  const [diseaseNotifs, setDiseaseNotifs] = useState(true);

  const alerts = [
    {
      id: 1,
      type: "weather",
      severity: "high",
      icon: CloudRain,
      title: "Heavy Rain Alert",
      message: "Heavy rainfall expected in your area for next 48 hours. Ensure proper drainage.",
      time: "2 hours ago",
      read: false,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      id: 2,
      type: "price",
      severity: "medium",
      icon: TrendingUp,
      title: "Rice Price Surge",
      message: "Rice prices increased by 12% in local mandi. Good time to sell!",
      time: "5 hours ago",
      read: false,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      id: 3,
      type: "disease",
      severity: "high",
      icon: Bug,
      title: "Disease Outbreak Warning",
      message: "Leaf blight cases reported in nearby farms. Monitor your crops closely.",
      time: "Yesterday",
      read: false,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      id: 4,
      type: "weather",
      severity: "low",
      icon: Info,
      title: "Optimal Irrigation Window",
      message: "Next 3 days will have ideal temperature for irrigation. Plan accordingly.",
      time: "Yesterday",
      read: true,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50"
    },
    {
      id: 5,
      type: "price",
      severity: "low",
      icon: TrendingUp,
      title: "Wheat Demand Forecast",
      message: "Wheat demand expected to rise by 8% next month based on market trends.",
      time: "2 days ago",
      read: true,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      id: 6,
      type: "system",
      severity: "low",
      icon: CheckCircle,
      title: "Soil Test Results Ready",
      message: "Your soil analysis report is now available. Check recommendations.",
      time: "2 days ago",
      read: true,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    }
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Medium</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const activeAlerts = alerts.filter(a => !a.read);
  const readAlerts = alerts.filter(a => a.read);

  return (
    <div className="flex-1 pb-20 bg-background">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell className="h-8 w-8 text-farmer-green mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-farmer-green">{t.alerts}</h1>
              <p className="text-sm text-gray-600">{activeAlerts.length} new alerts</p>
            </div>
          </div>
          {activeAlerts.length > 0 && (
            <div className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
              {activeAlerts.length}
            </div>
          )}
        </div>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-farmer-green text-lg">Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Weather Alerts</span>
              </div>
              <Switch checked={weatherNotifs} onCheckedChange={setWeatherNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-medium">Price Alerts</span>
              </div>
              <Switch checked={priceNotifs} onCheckedChange={setPriceNotifs} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-500" />
                <span className="font-medium">Disease Warnings</span>
              </div>
              <Switch checked={diseaseNotifs} onCheckedChange={setDiseaseNotifs} />
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        {activeAlerts.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-farmer-green flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Alerts
            </h2>
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${alert.read ? 'opacity-60' : ''}`} style={{ borderLeftColor: alert.color.replace('text-', '') }}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`${alert.bgColor} p-3 rounded-lg h-fit`}>
                        <alert.icon className={`h-6 w-6 ${alert.color}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{alert.title}</h3>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{alert.time}</span>
                          <button className="text-xs text-farmer-green hover:underline font-medium">
                            Mark as read
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Read Alerts */}
        {readAlerts.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-600 flex items-center gap-2 mt-6">
              <CheckCircle className="h-5 w-5" />
              Previous Alerts
            </h2>
            <div className="space-y-3">
              {readAlerts.map((alert) => (
                <Card key={alert.id} className="opacity-60 border-l-4" style={{ borderLeftColor: alert.color.replace('text-', '') }}>
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className={`${alert.bgColor} p-2 rounded-lg h-fit`}>
                        <alert.icon className={`h-5 w-5 ${alert.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-700">{alert.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <span className="text-xs text-gray-500 mt-2 block">{alert.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
