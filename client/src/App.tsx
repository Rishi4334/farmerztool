import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { Header } from "@/components/header";
import { VoiceAssistant } from "@/components/voice-assistant";
import { BottomNavigation } from "@/components/bottom-navigation";
import { InitialLanguageSelector } from "@/components/language-selector";
import Home from "@/pages/home";
import PlantDoctor from "@/pages/plant-doctor";
import Weather from "@/pages/weather";
import Market from "@/pages/market";
import SellDirect from "@/pages/sell-direct";
import KnowledgeHub from "@/pages/knowledge-hub";
import ExpertConnect from "@/pages/expert-connect";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/plant-doctor" component={PlantDoctor} />
      <Route path="/weather" component={Weather} />
      <Route path="/market" component={Market} />
      <Route path="/sell-direct" component={SellDirect} />
      <Route path="/knowledge-hub" component={KnowledgeHub} />
      <Route path="/expert-connect" component={ExpertConnect} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <VoiceAssistant />
      <main className="flex-1">
        <Router />
      </main>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <InitialLanguageSelector />
          <AppLayout />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
