import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/hooks/use-language";
import { ThemeProvider } from "@/hooks/use-theme";
import { Header } from "@/components/header";
import { VoiceAssistant } from "@/components/voice-assistant";
import { BottomNavigation } from "@/components/bottom-navigation";
import { InitialLanguageSelector } from "@/components/language-selector";
import Home from "@/pages/home";
import Login from "@/pages/login";
import PlantDoctor from "@/pages/plant-doctor";
import Weather from "@/pages/weather";
import Market from "@/pages/market";
import SellDirect from "@/pages/sell-direct";
import KnowledgeHub from "@/pages/knowledge-hub";
import ExpertConnect from "@/pages/expert-connect";
import Analytics from "@/pages/analytics";
import Alerts from "@/pages/alerts";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const user = localStorage.getItem("user");
  
  if (!user) {
    return <Login />;
  }
  
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        <ProtectedRoute component={Home} />
      </Route>
      <Route path="/plant-doctor">
        <ProtectedRoute component={PlantDoctor} />
      </Route>
      <Route path="/weather">
        <ProtectedRoute component={Weather} />
      </Route>
      <Route path="/market">
        <ProtectedRoute component={Market} />
      </Route>
      <Route path="/sell-direct">
        <ProtectedRoute component={SellDirect} />
      </Route>
      <Route path="/knowledge-hub">
        <ProtectedRoute component={KnowledgeHub} />
      </Route>
      <Route path="/expert-connect">
        <ProtectedRoute component={ExpertConnect} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={Analytics} />
      </Route>
      <Route path="/alerts">
        <ProtectedRoute component={Alerts} />
      </Route>
      <Route path="/profile">
        <ProtectedRoute component={Profile} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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
        <ThemeProvider>
          <LanguageProvider>
            <Toaster />
            <InitialLanguageSelector />
            <AppLayout />
          </LanguageProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
