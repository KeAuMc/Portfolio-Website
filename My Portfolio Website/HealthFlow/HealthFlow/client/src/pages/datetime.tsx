import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import MobileHeader from "@/components/mobile-header";
import ProgressIndicator from "@/components/progress-indicator";
import { useAppointmentStore } from "@/lib/appointment-store";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import type { TimeSlot } from "@shared/schema";

export default function DateTime() {
  const [, setLocation] = useLocation();
  const { selectedProvider, selectedDate, selectedTime, setDateTime } = useAppointmentStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState<string | null>(selectedDate);

  useEffect(() => {
    if (!selectedProvider) {
      setLocation("/schedule");
    }
  }, [selectedProvider, setLocation]);

  const { data: timeSlots, isLoading } = useQuery<TimeSlot[]>({
    queryKey: ["/api/providers", selectedProvider?.id, "slots", tempSelectedDate],
    queryFn: async () => {
      if (!selectedProvider?.id || !tempSelectedDate) return [];
      
      const response = await fetch(`/api/providers/${selectedProvider.id}/slots/${tempSelectedDate}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch time slots");
      return response.json();
    },
    enabled: !!selectedProvider?.id && !!tempSelectedDate,
  });

  const handleDateSelect = (date: string) => {
    setTempSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    if (tempSelectedDate) {
      setDateTime(tempSelectedDate, time);
    }
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      setLocation("/confirmation");
    }
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isPast = currentDate < today;
      const isToday = currentDate.toDateString() === today.toDateString();
      const dateString = currentDate.toISOString().split('T')[0];
      const isSelected = dateString === tempSelectedDate;
      
      days.push({
        date: currentDate,
        dateString,
        isCurrentMonth,
        isPast,
        isToday,
        isSelected,
        day: currentDate.getDate(),
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (!selectedProvider) {
    return null;
  }

  return (
    <div className="animate-fade-in">
      <MobileHeader
        title="Select Date & Time"
        subtitle={`Dr. ${selectedProvider.firstName} ${selectedProvider.lastName} - ${selectedProvider.specialty}`}
        showBack={true}
        backTo="/schedule"
      />

      <ProgressIndicator
        currentStep={2}
        totalSteps={3}
        stepLabel="Date & Time"
      />

      {/* Calendar */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Choose a date</h3>
        <Card>
          <CardContent className="p-4">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                aria-label="Previous month"
                data-testid="button-prev-month"
              >
                <ChevronLeft size={20} />
              </Button>
              <h4 className="font-semibold" data-testid="text-current-month">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                aria-label="Next month"
                data-testid="button-next-month"
              >
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}

              {calendarDays.map((day, index) => (
                <Button
                  key={index}
                  variant={day.isSelected ? "default" : "ghost"}
                  size="sm"
                  className={`p-2 text-sm h-10 ${
                    !day.isCurrentMonth || day.isPast
                      ? "text-muted-foreground opacity-50 cursor-not-allowed"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => day.isCurrentMonth && !day.isPast && handleDateSelect(day.dateString)}
                  disabled={!day.isCurrentMonth || day.isPast}
                  data-testid={`button-date-${day.dateString}`}
                >
                  {day.day}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Slots */}
      {tempSelectedDate && (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Available times for {new Date(tempSelectedDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {isLoading ? (
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
          ) : timeSlots?.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="mx-auto mb-2 text-muted-foreground" size={32} />
                <p className="text-muted-foreground">No available time slots for this date</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {timeSlots?.map((slot) => (
                <Button
                  key={slot.id}
                  variant={selectedTime === slot.time ? "default" : "outline"}
                  className="h-auto p-3 flex flex-col items-center space-y-1"
                  onClick={() => handleTimeSelect(slot.time)}
                  data-testid={`button-time-${slot.time}`}
                >
                  <div className="font-medium">{formatTime(slot.time)}</div>
                  <div className="text-xs opacity-80">{slot.duration} min</div>
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTime && (
        <div className="p-4">
          <Button
            className="w-full"
            onClick={handleContinue}
            data-testid="button-continue"
          >
            Continue to Confirmation
          </Button>
        </div>
      )}
    </div>
  );
}
