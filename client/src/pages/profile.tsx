import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Phone, Languages, Moon, Sun, LogOut, Settings, Bell, Shield } from "lucide-react";
import { useTranslation, useLanguage } from "@/hooks/use-language";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES, type Language } from "@/lib/constants";
import { useState } from "react";

export default function Profile() {
  const t = useTranslation();
  const { currentLanguage, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [userData, setUserData] = useState({
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    location: "Guntur, Andhra Pradesh",
    farmSize: "5.5 acres",
    mainCrop: "Rice & Cotton"
  });

  const [notifications, setNotifications] = useState({
    weather: true,
    prices: true,
    disease: true,
    marketing: false
  });

  const stats = [
    { label: "Total Crops", value: "6", icon: "🌾" },
    { label: "Active Listings", value: "3", icon: "📦" },
    { label: "Consultations", value: "12", icon: "👨‍🌾" },
    { label: "Days Active", value: "145", icon: "📅" }
  ];

  return (
    <div className="flex-1 pb-20 bg-background">
      <div className="p-4 space-y-4">
        {/* Profile Header */}
        <Card className="bg-gradient-to-r from-farmer-green to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-4">
                <User className="h-12 w-12 text-farmer-green" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-green-50">Premium Farmer</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <p className="text-2xl font-bold text-farmer-green">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-farmer-green">
              <Settings className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input 
                id="phone" 
                value={userData.phone}
                onChange={(e) => setUserData({...userData, phone: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input 
                id="location" 
                value={userData.location}
                onChange={(e) => setUserData({...userData, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="farmSize">Farm Size</Label>
                <Input 
                  id="farmSize" 
                  value={userData.farmSize}
                  onChange={(e) => setUserData({...userData, farmSize: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="mainCrop">Main Crop</Label>
                <Input 
                  id="mainCrop" 
                  value={userData.mainCrop}
                  onChange={(e) => setUserData({...userData, mainCrop: e.target.value})}
                />
              </div>
            </div>
            <Button className="w-full bg-farmer-green hover:bg-green-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-farmer-green">
              <Languages className="h-5 w-5 mr-2" />
              Language Preference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    currentLanguage === lang
                      ? 'border-farmer-green bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{LANGUAGES[lang].name}</p>
                      <p className="text-sm text-gray-600">{LANGUAGES[lang].nativeName}</p>
                    </div>
                    {currentLanguage === lang && (
                      <div className="h-6 w-6 bg-farmer-green rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-farmer-green">
              <Settings className="h-5 w-5 mr-2" />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <span className="font-medium">Dark Mode</span>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="font-medium">Two-Factor Auth</span>
              </div>
              <Switch defaultChecked={false} />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-farmer-green">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Weather Alerts</span>
              <Switch 
                checked={notifications.weather}
                onCheckedChange={(checked) => setNotifications({...notifications, weather: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Price Updates</span>
              <Switch 
                checked={notifications.prices}
                onCheckedChange={(checked) => setNotifications({...notifications, prices: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Disease Warnings</span>
              <Switch 
                checked={notifications.disease}
                onCheckedChange={(checked) => setNotifications({...notifications, disease: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Marketing Tips</span>
              <Switch 
                checked={notifications.marketing}
                onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full border-red-500 text-red-500 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>

        {/* App Version */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>FarmerZ v1.0.0</p>
          <p className="text-xs">Last synced: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}
