import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/lib/auth-store";
import { Calendar, History, MessageCircle, Pill, CalendarPlus, Clock, User, Settings, Info } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const { data: appointments, isLoading } = useQuery({
    queryKey: ["/api/appointments"],
    queryFn: async () => {
      const response = await fetch(`/api/appointments?userId=${user?.id}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch appointments");
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (!isAuthenticated || !user) {
    return null;
  }

  const upcomingAppointments = appointments?.filter((apt: any) => 
    new Date(`${apt.date}T${apt.time}`) > new Date()
  ) || [];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-foreground bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h2 className="font-semibold" data-testid="text-user-name">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-primary-foreground/80" data-testid="text-user-role">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="hover:bg-primary-foreground/10"
            aria-label="Account settings"
            data-testid="button-account-settings"
          >
            <Settings className="text-primary-foreground" size={20} />
          </Button>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-primary">
        <p className="text-sm text-foreground flex items-center">
          <Info className="text-primary mr-2" size={16} />
          Good morning! You have {upcomingAppointments.length} upcoming appointments this week.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
            onClick={() => setLocation("/schedule")}
            data-testid="button-schedule"
          >
            <CalendarPlus className="text-primary" size={24} />
            <div>
              <div className="text-sm font-medium">Schedule</div>
              <div className="text-xs text-muted-foreground">New appointment</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
            data-testid="button-history"
          >
            <History className="text-secondary" size={24} />
            <div>
              <div className="text-sm font-medium">History</div>
              <div className="text-xs text-muted-foreground">Past visits</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
            data-testid="button-messages"
          >
            <MessageCircle className="text-blue-500" size={24} />
            <div>
              <div className="text-sm font-medium">Messages</div>
              <div className="text-xs text-muted-foreground">2 unread</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-shadow"
            data-testid="button-medications"
          >
            <Pill className="text-orange-500" size={24} />
            <div>
              <div className="text-sm font-medium">Medications</div>
              <div className="text-xs text-muted-foreground">View list</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="px-4 pb-4">
        <h3 className="text-lg font-semibold mb-4">Upcoming Appointments</h3>
        
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2 mb-3"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-muted rounded flex-1"></div>
                    <div className="h-8 bg-muted rounded flex-1"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : upcomingAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="mx-auto mb-2 text-muted-foreground" size={32} />
              <p className="text-muted-foreground">No upcoming appointments</p>
              <Button
                className="mt-3"
                onClick={() => setLocation("/schedule")}
                data-testid="button-schedule-first"
              >
                Schedule Your First Appointment
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcomingAppointments.map((appointment: any) => (
              <Card key={appointment.id} className="hover:shadow-md transition-shadow" data-testid={`card-appointment-${appointment.id}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-foreground" data-testid={`text-provider-${appointment.id}`}>
                        Dr. {appointment.provider.firstName} {appointment.provider.lastName}
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid={`text-specialty-${appointment.id}`}>
                        {appointment.provider.specialty}
                      </p>
                    </div>
                    <Badge variant={appointment.status === "confirmed" ? "default" : "secondary"} data-testid={`badge-status-${appointment.id}`}>
                      {appointment.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="mr-2" size={14} />
                    <span data-testid={`text-date-${appointment.id}`}>
                      {new Date(appointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                    <Clock className="ml-4 mr-2" size={14} />
                    <span data-testid={`text-time-${appointment.id}`}>{appointment.time}</span>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      data-testid={`button-reschedule-${appointment.id}`}
                    >
                      Reschedule
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      data-testid={`button-details-${appointment.id}`}
                    >
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* In-App Notification */}
      {upcomingAppointments.length > 0 && (
        <div className="mx-4 mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4" data-testid="notification-reminder">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">Appointment Reminder</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Your next appointment is coming up. Please arrive 15 minutes early.
              </p>
              <Button 
                variant="link" 
                className="text-primary text-sm p-0 h-auto mt-2"
                data-testid="button-dismiss-notification"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
