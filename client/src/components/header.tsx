import { Button } from "@/components/ui/button";
import { Bell, Languages, Sprout, LogOut } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { useState } from "react";
import { LanguageSelector } from "./language-selector";
import { ThemeToggle } from "./theme-toggle";
import { useLocation } from "wouter";

export function Header() {
  const t = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [location, setLocation] = useLocation();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Don't show header on login page
  if (location === "/login") {
    return null;
  }

  return (
    <>
      <header className="bg-farmer-green text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sprout className="h-8 w-8 mr-3" />
            <h1 className="text-xl font-bold">{t.appName}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLocation("/alerts")}
              className="touch-button text-white hover:bg-farmer-green-light"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLanguageSelector(true)}
              className="touch-button text-white hover:bg-farmer-green-light"
              title="Change Language"
            >
              <Languages className="h-5 w-5" />
            </Button>
            {user && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout} 
                className="touch-button text-white hover:bg-red-600"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <LanguageSelector
        isOpen={showLanguageSelector}
        onClose={() => setShowLanguageSelector(false)}
      />
    </>
  );
}