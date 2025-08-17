import { AlertTriangle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/hooks/use-voice";
import { useTranslation } from "@/hooks/use-language";

interface WeatherAlertProps {
  alertType: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function WeatherAlert({ alertType, message, severity }: WeatherAlertProps) {
  const { speak } = useVoice();
  const t = useTranslation();

  const severityColors = {
    low: 'bg-blue-100 dark:bg-blue-900/20 border-blue-500 text-blue-800 dark:text-blue-200',
    medium: 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200',
    high: 'bg-orange-100 dark:bg-orange-900/20 border-orange-500 text-orange-800 dark:text-orange-200',
    critical: 'bg-red-100 dark:bg-red-900/20 border-red-500 text-red-800 dark:text-red-200'
  };

  const handleListen = () => {
    speak(`${t.weatherAlert}: ${message}`);
  };

  return (
    <div className={`border-l-4 p-4 m-4 rounded-r-lg ${severityColors[severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 mr-3 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">{t.weatherAlert}</p>
            <p className="text-sm mt-1">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleListen}
          className="touch-button ml-2"
        >
          <Volume2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
