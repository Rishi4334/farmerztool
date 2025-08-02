import { Button } from "@/components/ui/button";
import { Bell, Languages, Sprout } from "lucide-react";
import { useTranslation } from "@/hooks/use-language";
import { useState } from "react";
import { LanguageSelector } from "./language-selector";

export function Header() {
  const t = useTranslation();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  return (
    <>
      <header className="bg-farmer-green text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sprout className="h-8 w-8 mr-3" />
            <h1 className="text-xl font-bold">{t.appName}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              className="touch-button text-white hover:bg-farmer-green-light"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowLanguageSelector(true)}
              className="touch-button text-white hover:bg-farmer-green-light"
            >
              <Languages className="h-5 w-5" />
            </Button>
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
