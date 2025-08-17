import { Button } from "@/components/ui/button";
import { Home, BarChart3, Bell, User } from "lucide-react";
import { useLocation } from "wouter";
import { useTranslation } from "@/hooks/use-language";
import { cn } from "@/lib/utils";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const t = useTranslation();

  const navItems = [
    { icon: Home, label: t.home, path: "/" },
    { icon: BarChart3, label: t.analytics, path: "/analytics" },
    { icon: Bell, label: t.alerts, path: "/alerts" },
    { icon: User, label: t.profile, path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-2 safe-area-pb">
      <div className="flex justify-around">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Button
            key={path}
            variant="ghost"
            onClick={() => setLocation(path)}
            className={cn(
              "flex flex-col items-center space-y-1 touch-button px-2 py-3 h-auto",
              location === path 
                ? "text-farmer-green" 
                : "text-muted-foreground hover:text-farmer-green"
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
}
