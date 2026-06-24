import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  Calendar, 
  MessageSquare, 
  CreditCard, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Info,
  Warning,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { format } from "date-fns";

interface NotificationCardProps {
  notification: any;
  compact?: boolean;
}

export function NotificationCard({ notification, compact = false }: NotificationCardProps) {
  const getNotificationIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "appointment":
        return <Calendar className="h-4 w-4 text-muted-foreground" />;
      case "message":
        return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
      case "billing":
        return <CreditCard className="h-4 w-4 text-muted-foreground" />;
      case "medical":
        return <User className="h-4 w-4 text-muted-foreground" />;
      case "alert":
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (!["high", "medium", "low"].includes(priority?.toLowerCase())) {
      return null;
    }
    return <StatusBadge status={priority} showIcon={false} />;
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent/50 transition-colors ${!notification.read ? 'bg-muted/50' : ''}`}>
        <div className="flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-sm truncate">
              {notification.title}
            </h4>
            {!notification.read && (
              <Badge variant="secondary" className="text-xs">
                New
              </Badge>
            )}
            {getPriorityBadge(notification.priority)}
          </div>
          
          <p className="text-xs text-muted-foreground truncate">
            {notification.message}
          </p>
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3" />
            <span>{format(new Date(notification.createdAt), "MMM dd, h:mm a")}</span>
          </div>
        </div>
        
        <Button variant="ghost" size="sm">
          <CheckCircle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${!notification.read ? 'border-foreground' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              {getNotificationIcon(notification.type)}
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {notification.title}
                {!notification.read && (
                  <Badge variant="secondary">
                    New
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground capitalize">
                {notification.type} Notification
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityBadge(notification.priority)}
            <div className="text-sm text-muted-foreground">
              {format(new Date(notification.createdAt), "MMM dd, yyyy h:mm a")}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h5 className="font-medium mb-2">Message:</h5>
          <p className="text-sm text-muted-foreground">{notification.message}</p>
        </div>

        {notification.actionUrl && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
            {!notification.read && (
              <Button size="sm">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Read
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
