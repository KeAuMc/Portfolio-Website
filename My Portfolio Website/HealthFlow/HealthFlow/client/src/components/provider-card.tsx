import { Card, CardContent } from "@/components/ui/card";
import { Star, Clock, ChevronRight, UserRound } from "lucide-react";

interface ProviderCardProps {
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    specialty: string;
    rating: string;
    reviewCount: number;
    location: string;
    room?: string;
  };
  onSelect?: (provider: any) => void;
}

export default function ProviderCard({ provider, onSelect }: ProviderCardProps) {
  const handleClick = () => {
    onSelect?.(provider);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Select Dr. ${provider.firstName} ${provider.lastName}, ${provider.specialty}`}
      data-testid={`card-provider-${provider.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
            <UserRound className="text-muted-foreground" size={24} />
          </div>
          <div className="flex-1">
            <h3 
              className="font-semibold text-foreground mb-1" 
              data-testid={`text-provider-name-${provider.id}`}
            >
              Dr. {provider.firstName} {provider.lastName}
            </h3>
            <p 
              className="text-sm text-muted-foreground mb-2" 
              data-testid={`text-provider-specialty-${provider.id}`}
            >
              {provider.specialty}
            </p>
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Star 
                className="text-yellow-400 mr-1" 
                size={14} 
                fill="currentColor" 
              />
              <span data-testid={`text-provider-rating-${provider.id}`}>
                {provider.rating}
              </span>
              <span className="mx-1">•</span>
              <span data-testid={`text-provider-reviews-${provider.id}`}>
                {provider.reviewCount} reviews
              </span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="text-secondary mr-2" size={14} />
              <span className="text-secondary font-medium">
                Next available: Tomorrow
              </span>
            </div>
          </div>
          <ChevronRight className="text-muted-foreground" size={20} />
        </div>
      </CardContent>
    </Card>
  );
}
