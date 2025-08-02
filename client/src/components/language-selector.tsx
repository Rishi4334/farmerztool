import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Globe } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { LANGUAGES, type Language } from "@/lib/constants";

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const { currentLanguage, setLanguage } = useLanguage();

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-farmer-green">
            Choose Your Language
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-4">
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <Button
              key={key}
              onClick={() => handleLanguageSelect(key as Language)}
              className={`w-full justify-start text-left h-14 ${
                currentLanguage === key 
                  ? 'bg-farmer-green text-white' 
                  : 'bg-white text-farmer-green border border-farmer-green hover:bg-farmer-green hover:text-white'
              }`}
              variant={currentLanguage === key ? "default" : "outline"}
            >
              <Globe className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-sm opacity-80">{lang.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function InitialLanguageSelector() {
  const { isFirstVisit, setLanguage } = useLanguage();

  if (!isFirstVisit) return null;

  const handleLanguageSelect = (language: Language) => {
    setLanguage(language);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold text-farmer-green mb-6 text-center">
          Choose Your Language
        </h2>
        <div className="space-y-3">
          {Object.entries(LANGUAGES).map(([key, lang]) => (
            <Button
              key={key}
              onClick={() => handleLanguageSelect(key as Language)}
              className="w-full justify-start text-left h-14 bg-farmer-green text-white hover:bg-farmer-green-light"
            >
              <Globe className="mr-3 h-5 w-5" />
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-sm opacity-90">{lang.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
