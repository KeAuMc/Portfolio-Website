import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  showSettings?: boolean;
}

export default function MobileHeader({ 
  title, 
  subtitle, 
  showBack = false, 
  backTo = "/dashboard",
  showSettings = false 
}: MobileHeaderProps) {
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation(backTo);
  };

  return (
    <div className="bg-background border-b border-border p-4 flex items-center">
      {showBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="mr-3 hover:bg-muted"
          aria-label="Go back"
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      )}
      
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {showSettings && (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-muted"
          aria-label="Account settings"
          data-testid="button-settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
