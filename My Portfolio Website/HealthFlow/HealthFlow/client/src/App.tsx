import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Schedule from "@/pages/schedule";
import DateTime from "@/pages/datetime";
import Confirmation from "@/pages/confirmation";
import Success from "@/pages/success";
import HighContrastToggle from "@/components/high-contrast-toggle";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/schedule" component={Schedule} />
      <Route path="/datetime" component={DateTime} />
      <Route path="/confirmation" component={Confirmation} />
      <Route path="/success" component={Success} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-soft-gray relative">
          <HighContrastToggle />
          <div className="mobile-container">
            <Router />
          </div>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
