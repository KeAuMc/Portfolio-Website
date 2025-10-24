import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

interface AppointmentCardProps {
  appointment: {
    id: string;
    date: string;
    time: string;
    status: string;
    provider: {
      id: string;
      firstName: string;
      lastName: string;
      specialty: string;
    };
  };
  onReschedule?: (appointmentId: string) => void;
  onViewDetails?: (appointmentId: string) => void;
}

export default function AppointmentCard({ 
  appointment, 
  onReschedule, 
  onViewDetails 
}: AppointmentCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'long', 
        day: 'numeric' 
      });
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow" 
      data-testid={`card-appointment-${appointment.id}`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 
              className="font-medium text-foreground" 
              data-testid={`text-provider-${appointment.id}`}
            >
              Dr. {appointment.provider.firstName} {appointment.provider.lastName}
            </h4>
            <p 
              className="text-sm text-muted-foreground" 
              data-testid={`text-specialty-${appointment.id}`}
            >
              {appointment.provider.specialty}
            </p>
          </div>
          <Badge 
            variant={getStatusVariant(appointment.status)}
            data-testid={`badge-status-${appointment.id}`}
          >
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Calendar className="mr-2" size={14} />
          <span data-testid={`text-date-${appointment.id}`}>
            {formatDate(appointment.date)}
          </span>
          <Clock className="ml-4 mr-2" size={14} />
          <span data-testid={`text-time-${appointment.id}`}>
            {formatTime(appointment.time)}
          </span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => onReschedule?.(appointment.id)}
            data-testid={`button-reschedule-${appointment.id}`}
          >
            Reschedule
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(appointment.id)}
            data-testid={`button-details-${appointment.id}`}
          >
            Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
