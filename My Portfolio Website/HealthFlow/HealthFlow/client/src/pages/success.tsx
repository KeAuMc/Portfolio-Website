import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAppointmentStore } from "@/lib/appointment-store";
import { Check, CalendarPlus } from "lucide-react";

export default function Success() {
  const [, setLocation] = useLocation();
  const { selectedProvider, selectedDate, selectedTime } = useAppointmentStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const addToCalendar = () => {
    if (!selectedProvider || !selectedDate || !selectedTime) return;

    // Create a simple calendar event
    const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 minutes later

    const event = {
      title: `Appointment with Dr. ${selectedProvider.firstName} ${selectedProvider.lastName}`,
      start: startDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      end: endDateTime.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''),
      description: `${selectedProvider.specialty} appointment at ${selectedProvider.location}`,
      location: `${selectedProvider.location}, ${selectedProvider.room}`,
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${event.start}/${event.end}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="p-6 text-center min-h-screen flex flex-col justify-center animate-fade-in">
      <div className="w-20 h-20 bg-secondary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
        <Check className="text-secondary" size={32} />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-success-title">
        Appointment Confirmed!
      </h2>
      <p className="text-muted-foreground mb-8">
        Your appointment has been successfully scheduled. You'll receive confirmation details shortly.
      </p>

      {selectedProvider && selectedDate && selectedTime && (
        <Card className="mb-8 text-left">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">Appointment Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Provider:</span>
                <span className="font-medium" data-testid="text-confirmed-provider">
                  Dr. {selectedProvider.firstName} {selectedProvider.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium" data-testid="text-confirmed-date">
                  {formatDate(selectedDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium" data-testid="text-confirmed-time">
                  {formatTime(selectedTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium" data-testid="text-confirmed-location">
                  {selectedProvider.location}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <Button
          className="w-full"
          onClick={() => setLocation("/dashboard")}
          data-testid="button-return-dashboard"
        >
          Return to Dashboard
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={addToCalendar}
          data-testid="button-add-calendar"
        >
          <CalendarPlus className="mr-2" size={16} />
          Add to Calendar
        </Button>
      </div>
    </div>
  );
}
