import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import MobileHeader from "@/components/mobile-header";
import ProgressIndicator from "@/components/progress-indicator";
import { useAppointmentStore } from "@/lib/appointment-store";
import { useAuthStore } from "@/lib/auth-store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CalendarCheck, UserRound, Calendar, Clock, Loader2 } from "lucide-react";

export default function Confirmation() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const {
    selectedProvider,
    selectedDate,
    selectedTime,
    notes,
    reminderEmail,
    reminderSms,
    reminderPhone,
    setNotes,
    setReminders,
    reset,
  } = useAppointmentStore();

  const createAppointmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedProvider || !selectedDate || !selectedTime || !user) {
        throw new Error("Missing required information");
      }

      return await apiRequest("POST", "/api/appointments", {
        userId: user.id,
        providerId: selectedProvider.id,
        date: selectedDate,
        time: selectedTime,
        notes,
        reminderEmail,
        reminderSms,
        reminderPhone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      reset();
      setLocation("/success");
      toast({
        title: "Appointment Confirmed!",
        description: "Your appointment has been successfully scheduled.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!selectedProvider || !selectedDate || !selectedTime) {
    setLocation("/schedule");
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
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

  const handleConfirm = () => {
    createAppointmentMutation.mutate();
  };

  return (
    <div className="animate-fade-in">
      <MobileHeader
        title="Confirm Appointment"
        showBack={true}
        backTo="/datetime"
      />

      <ProgressIndicator
        currentStep={3}
        totalSteps={3}
        stepLabel="Confirmation"
      />

      {/* Appointment Summary */}
      <div className="p-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CalendarCheck className="text-secondary" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Review Your Appointment</h3>
              <p className="text-muted-foreground">Please confirm the details below</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-soft-gray rounded-xl">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                  <UserRound className="text-muted-foreground" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground" data-testid="text-provider-name">
                    Dr. {selectedProvider.firstName} {selectedProvider.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid="text-provider-specialty">
                    {selectedProvider.specialty}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1" data-testid="text-provider-location">
                    {selectedProvider.location}, {selectedProvider.room}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-soft-gray rounded-xl">
                  <div className="flex items-center mb-2">
                    <Calendar className="text-primary mr-2" size={16} />
                    <span className="text-sm font-medium">Date</span>
                  </div>
                  <p className="font-semibold" data-testid="text-appointment-date">
                    {formatDate(selectedDate)}
                  </p>
                </div>

                <div className="p-4 bg-soft-gray rounded-xl">
                  <div className="flex items-center mb-2">
                    <Clock className="text-primary mr-2" size={16} />
                    <span className="text-sm font-medium">Time</span>
                  </div>
                  <p className="font-semibold" data-testid="text-appointment-time">
                    {formatTime(selectedTime)}
                  </p>
                  <p className="text-sm text-muted-foreground">30 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Notes */}
      <div className="p-4">
        <Label htmlFor="appointment-notes">
          Reason for visit or special notes (optional)
        </Label>
        <Textarea
          id="appointment-notes"
          rows={3}
          className="mt-2 resize-none"
          placeholder="e.g., Follow-up on test results, experiencing chest pain..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          data-testid="textarea-appointment-notes"
        />
      </div>

      {/* Reminder Preferences */}
      <div className="p-4">
        <h4 className="font-medium text-foreground mb-3">Reminder preferences</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reminder-email"
              checked={reminderEmail}
              onCheckedChange={(checked) => setReminders(!!checked, reminderSms, reminderPhone)}
              data-testid="checkbox-reminder-email"
            />
            <Label htmlFor="reminder-email" className="text-sm">
              Email reminder (24 hours before)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reminder-sms"
              checked={reminderSms}
              onCheckedChange={(checked) => setReminders(reminderEmail, !!checked, reminderPhone)}
              data-testid="checkbox-reminder-sms"
            />
            <Label htmlFor="reminder-sms" className="text-sm">
              Text message reminder (2 hours before)
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="reminder-phone"
              checked={reminderPhone}
              onCheckedChange={(checked) => setReminders(reminderEmail, reminderSms, !!checked)}
              data-testid="checkbox-reminder-phone"
            />
            <Label htmlFor="reminder-phone" className="text-sm">
              Phone call reminder (if needed)
            </Label>
          </div>
        </div>
      </div>

      {/* Confirmation Actions */}
      <div className="p-4 space-y-3">
        <Button
          className="w-full bg-secondary hover:bg-secondary/90"
          onClick={handleConfirm}
          disabled={createAppointmentMutation.isPending}
          data-testid="button-confirm-appointment"
        >
          {createAppointmentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Confirm Appointment
        </Button>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setLocation("/datetime")}
          disabled={createAppointmentMutation.isPending}
          data-testid="button-change-datetime"
        >
          Change Date/Time
        </Button>
      </div>
    </div>
  );
}
