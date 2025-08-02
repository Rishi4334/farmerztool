import { useState, useEffect, createContext, useContext } from 'react';
import { LANGUAGES, type Language } from '@/lib/constants';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  isFirstVisit: boolean;
  setIsFirstVisit: (value: boolean) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('farmerz-language') as Language;
    const hasVisited = localStorage.getItem('farmerz-visited');
    
    if (savedLanguage && LANGUAGES[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
    
    if (hasVisited) {
      setIsFirstVisit(false);
    }
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('farmerz-language', language);
    localStorage.setItem('farmerz-visited', 'true');
    setIsFirstVisit(false);
  };

  return (
    <LanguageContext.Provider 
      value={{
        currentLanguage,
        setLanguage,
        isFirstVisit,
        setIsFirstVisit
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translation strings (simplified for MVP)
export const translations = {
  english: {
    appName: 'FarmerZ Tool',
    chooseLanguage: 'Choose Your Language',
    pressToSpeak: 'Press to speak',
    askAnything: 'Ask me anything about farming!',
    listening: 'Listening... Speak now!',
    weatherAlert: 'Weather Alert',
    plantDoctor: 'Plant Doctor',
    weather: 'Weather',
    market: 'Market',
    sellDirect: 'Sell Direct',
    learn: 'Learn',
    expertHelp: 'Expert Help',
    recentActivity: 'Recent Activity',
    home: 'Home',
    analytics: 'Analytics',
    alerts: 'Alerts',
    profile: 'Profile'
  },
  hindi: {
    appName: 'फार्मरज टूल',
    chooseLanguage: 'अपनी भाषा चुनें',
    pressToSpeak: 'बोलने के लिए दबाएं',
    askAnything: 'खेती के बारे में कुछ भी पूछें!',
    listening: 'सुन रहा हूं... अब बोलें!',
    weatherAlert: 'मौसम चेतावनी',
    plantDoctor: 'पौधे डॉक्टर',
    weather: 'मौसम',
    market: 'बाज़ार',
    sellDirect: 'सीधे बेचें',
    learn: 'सीखें',
    expertHelp: 'विशेषज्ञ सहायता',
    recentActivity: 'हाल की गतिविधि',
    home: 'होम',
    analytics: 'विश्लेषण',
    alerts: 'अलर्ट',
    profile: 'प्रोफ़ाइल'
  },
  telugu: {
    appName: 'ఫార్మర్జ్ టూల్',
    chooseLanguage: 'మీ భాషను ఎంచుకోండి',
    pressToSpeak: 'మాట్లాడటానికి నొక్కండి',
    askAnything: 'వ్యవసాయం గురించి ఏదైనా అడగండి!',
    listening: 'వింటున్నాను... ఇప్పుడు మాట్లాడండి!',
    weatherAlert: 'వాతావరణ హెచ్చరిక',
    plantDoctor: 'మొక్క వైద్యుడు',
    weather: 'వాతావరణం',
    market: 'మార్కెట్',
    sellDirect: 'నేరుగా అమ్మండి',
    learn: 'నేర్చుకోండి',
    expertHelp: 'నిపుణుల సహాయం',
    recentActivity: 'ఇటీవలి కార్యకలాపాలు',
    home: 'హోమ్',
    analytics: 'విశ్లేషణలు',
    alerts: 'హెచ్చరికలు',
    profile: 'ప్రొఫైల్'
  }
};

export function useTranslation() {
  const { currentLanguage } = useLanguage();
  return translations[currentLanguage];
}
