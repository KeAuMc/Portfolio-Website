import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

export default function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("high-contrast");
    if (saved === "true") {
      setIsHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    
    if (newValue) {
      document.documentElement.classList.add("high-contrast");
      localStorage.setItem("high-contrast", "true");
    } else {
      document.documentElement.classList.remove("high-contrast");
      localStorage.setItem("high-contrast", "false");
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleHighContrast}
        className="bg-background shadow-lg hover:shadow-xl transition-shadow rounded-full"
        aria-label={isHighContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
        data-testid="button-toggle-contrast"
      >
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
}
