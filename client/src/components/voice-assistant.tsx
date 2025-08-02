import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { useVoice } from "@/hooks/use-voice";
import { useTranslation } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export function VoiceAssistant() {
  const { 
    isListening, 
    isSupported, 
    transcript, 
    error, 
    toggleListening, 
    speak, 
    isSpeaking 
  } = useVoice();
  const t = useTranslation();

  const handleSpeak = (text: string) => {
    speak(text);
  };

  if (!isSupported) {
    return (
      <div className="bg-farmer-orange p-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="bg-white text-farmer-orange p-3 rounded-full shadow-lg opacity-50">
            <MicOff className="h-6 w-6" />
          </div>
          <div className="text-white text-center">
            <p className="font-medium">Voice not supported</p>
            <p className="text-sm opacity-90">Please update your browser</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-farmer-orange p-4">
      <div className="flex items-center justify-center space-x-4">
        <Button
          onClick={toggleListening}
          className={cn(
            "touch-button p-3 rounded-full shadow-lg transition-all duration-200",
            isListening 
              ? "bg-red-500 text-white voice-listening" 
              : "bg-white text-farmer-orange hover:bg-gray-50"
          )}
          disabled={isSpeaking}
        >
          {isListening ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
        
        <div className="text-white text-center flex-1">
          <p className="font-medium">
            {isListening ? t.listening : t.pressToSpeak}
          </p>
          <p className="text-sm opacity-90">
            {transcript || error || t.askAnything}
          </p>
        </div>

        <Button
          onClick={() => handleSpeak(t.askAnything)}
          className="touch-button p-3 rounded-full bg-white text-farmer-orange hover:bg-gray-50 shadow-lg"
          disabled={isSpeaking}
        >
          <Volume2 className={cn("h-6 w-6", isSpeaking && "animate-pulse")} />
        </Button>
      </div>
    </div>
  );
}
