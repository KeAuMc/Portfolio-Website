import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarPickerProps {
  selectedDate?: string | null;
  onDateSelect: (date: string) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function CalendarPicker({ 
  selectedDate, 
  onDateSelect, 
  minDate = new Date(),
  maxDate 
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = currentDate.getMonth() === month;
      const isPast = currentDate < minDate;
      const isFuture = maxDate && currentDate > maxDate;
      const isDisabled = isPast || isFuture;
      const dateString = currentDate.toISOString().split('T')[0];
      const isSelected = dateString === selectedDate;
      
      days.push({
        date: currentDate,
        dateString,
        isCurrentMonth,
        isDisabled,
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

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateSelect = (dateString: string) => {
    onDateSelect(dateString);
  };

  return (
    <Card>
      <CardContent className="p-4">
        {/* Calendar header */}
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPreviousMonth}
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
            onClick={goToNextMonth}
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
                !day.isCurrentMonth || day.isDisabled
                  ? "text-muted-foreground opacity-50 cursor-not-allowed"
                  : "hover:bg-muted"
              }`}
              onClick={() => day.isCurrentMonth && !day.isDisabled && handleDateSelect(day.dateString)}
              disabled={!day.isCurrentMonth || day.isDisabled}
              data-testid={`button-date-${day.dateString}`}
              aria-label={`Select ${day.date.toLocaleDateString()}`}
            >
              {day.day}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
