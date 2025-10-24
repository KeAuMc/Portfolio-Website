import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import MobileHeader from "@/components/mobile-header";
import ProgressIndicator from "@/components/progress-indicator";
import { useAppointmentStore } from "@/lib/appointment-store";
import { Star, Clock, ChevronRight, UserRound } from "lucide-react";
import type { Provider } from "@shared/schema";

export default function Schedule() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const { setProvider } = useAppointmentStore();

  const { data: providers, isLoading } = useQuery<Provider[]>({
    queryKey: ["/api/providers", searchQuery, selectedSpecialty],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedSpecialty && selectedSpecialty !== "All Specialties") {
        params.append("specialty", selectedSpecialty);
      }
      
      const response = await fetch(`/api/providers?${params}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch providers");
      return response.json();
    },
  });

  const handleSelectProvider = (provider: Provider) => {
    setProvider(provider);
    setLocation("/datetime");
  };

  const specialties = [
    "All Specialties",
    "Cardiology",
    "General Practice",
    "Dermatology",
    "Pediatrics",
  ];

  return (
    <div className="animate-fade-in">
      <MobileHeader
        title="Schedule Appointment"
        showBack={true}
        backTo="/dashboard"
      />

      <ProgressIndicator
        currentStep={1}
        totalSteps={3}
        stepLabel="Select Provider"
      />

      {/* Search and Filters */}
      <div className="p-4 bg-background border-b border-border">
        <div className="mb-4">
          <Label htmlFor="provider-search">Search by name or specialty</Label>
          <Input
            id="provider-search"
            placeholder="e.g., Dr. Smith or Cardiology"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mt-2"
            data-testid="input-provider-search"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger data-testid="select-specialty">
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger data-testid="select-availability">
              <SelectValue placeholder="Any Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Time</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="next-week">Next Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Provider List */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : providers?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <UserRound className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">No providers found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {providers?.map((provider) => (
              <Card
                key={provider.id}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectProvider(provider)}
                data-testid={`card-provider-${provider.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <UserRound className="text-muted-foreground" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1" data-testid={`text-provider-name-${provider.id}`}>
                        Dr. {provider.firstName} {provider.lastName}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2" data-testid={`text-provider-specialty-${provider.id}`}>
                        {provider.specialty}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Star className="text-yellow-400 mr-1" size={14} fill="currentColor" />
                        <span data-testid={`text-provider-rating-${provider.id}`}>{provider.rating}</span>
                        <span className="mx-1">•</span>
                        <span data-testid={`text-provider-reviews-${provider.id}`}>{provider.reviewCount} reviews</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="text-secondary mr-2" size={14} />
                        <span className="text-secondary font-medium">Next available: Tomorrow</span>
                      </div>
                    </div>
                    <ChevronRight className="text-muted-foreground" size={20} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
