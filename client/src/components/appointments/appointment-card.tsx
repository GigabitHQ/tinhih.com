import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  Phone,
  Video,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";

interface AppointmentCardProps {
  appointment: any;
  compact?: boolean;
}

export function AppointmentCard({ appointment, compact = false }: AppointmentCardProps) {
  const getStatusBadge = (status: string) => {
    const known = ["confirmed", "pending", "cancelled"];
    return <StatusBadge status={known.includes(status) ? status : "scheduled"} />;
  };

  const getAppointmentTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "telehealth":
      case "video":
        return <Video className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors">
        <div className="flex-shrink-0">
          <Avatar className="h-10 w-10">
            <AvatarImage src={appointment.practitioner?.user?.profileImage} />
            <AvatarFallback className="text-sm bg-muted text-foreground">
              {appointment.practitioner?.user?.firstName?.[0]}{appointment.practitioner?.user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">
              Dr. {appointment.practitioner?.user?.firstName} {appointment.practitioner?.user?.lastName}
            </h4>
            {getStatusBadge(appointment.status)}
          </div>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(appointment.appointmentDate), "MMM dd, yyyy")}</span>
            <Clock className="h-3 w-3 ml-2" />
            <span>{format(new Date(appointment.appointmentDate), "h:mm a")}</span>
            {getAppointmentTypeIcon(appointment.type)}
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={appointment.practitioner?.user?.profileImage} />
              <AvatarFallback className="text-sm bg-muted text-foreground">
                {appointment.practitioner?.user?.firstName?.[0]}{appointment.practitioner?.user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                Dr. {appointment.practitioner?.user?.firstName} {appointment.practitioner?.user?.lastName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {appointment.practitioner?.specialization || "General Practitioner"}
              </p>
            </div>
          </div>
          {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(appointment.appointmentDate), "EEEE, MMMM dd, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(appointment.appointmentDate), "h:mm a")}</span>
          </div>
          <div className="flex items-center gap-2">
            {getAppointmentTypeIcon(appointment.type)}
            <span className="capitalize">{appointment.type || "In-person"}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{appointment.duration || 30} minutes</span>
          </div>
        </div>

        {appointment.notes && (
          <div className="text-sm">
            <h5 className="font-medium mb-1">Notes:</h5>
            <p className="text-muted-foreground">{appointment.notes}</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
          {appointment.status === "confirmed" && (
            <Button size="sm" className="flex-1">
              Join Meeting
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
