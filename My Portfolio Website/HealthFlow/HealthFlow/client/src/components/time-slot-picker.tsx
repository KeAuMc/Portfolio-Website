import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Loader2 } from "lucide-react";

interface TimeSlot {
  id: string;
  time: string;
  duration: number;
  isAvailable: boolean;
}

interface TimeSlotPickerProps {
  timeSlots?: TimeSlot[];
  selectedTime?: string | null;
  onTimeSelect: (time: string) => void;
  isLoading?: boolean;
  date?: string;
}

export default function TimeSlotPicker({ 
  timeSlots = [], 
  selectedTime, 
  onTimeSelect, 
  isLoading = false,
  date 
}: TimeSlotPickerProps) {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading available times...</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-3">
                <div className="h-4 bg-muted rounded mb-1"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Clock className="mx-auto mb-2 text-muted-foreground" size={32} />
          <p className="text-muted-foreground">
            {date 
              ? `No available time slots for ${formatDate(date)}`
              : "No available time slots"
            }
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {date && (
        <h3 className="text-lg font-semibold">
          Available times for {formatDate(date)}
        </h3>
      )}
      
      <div className="grid grid-cols-2 gap-3">
        {timeSlots.map((slot) => (
          <Button
            key={slot.id}
            variant={selectedTime === slot.time ? "default" : "outline"}
            className="h-auto p-3 flex flex-col items-center space-y-1 hover:shadow-md transition-shadow focus:ring-2 focus:ring-primary"
            onClick={() => onTimeSelect(slot.time)}
            disabled={!slot.isAvailable}
            data-testid={`button-time-${slot.time}`}
            aria-label={`Select ${formatTime(slot.time)} appointment slot`}
          >
            <div className="font-medium">
              {formatTime(slot.time)}
            </div>
            <div className="text-xs opacity-80">
              {slot.duration} min
            </div>
            {!slot.isAvailable && (
              <div className="text-xs text-destructive">
                Unavailable
              </div>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
