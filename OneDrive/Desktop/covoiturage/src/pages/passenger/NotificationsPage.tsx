import React, { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCircle, XCircle, AlertTriangle, Info, Calendar, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notificationService } from '../../services/notificationService';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';


export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notifications = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications_list', user?.id],
    queryFn: () => (user ? notificationService.getNotifications(user.id) : []),
    enabled: !!user,
  });

  // Mark all as read mutation
  const markAllMutation = useMutation({
    mutationFn: () => (user ? notificationService.markAllAsRead(user.id) : Promise.resolve()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications_list', user?.id] });
      queryClient.invalidateQueries({ queryKey: ['notifications_unread_count', user?.id] });
    },
  });

  // Auto-mark all notifications as read when opening this page
  useEffect(() => {
    if (user && notifications.length > 0 && notifications.some(n => !n.read)) {
      markAllMutation.mutate();
    }
  }, [user, notifications, markAllMutation]);

  const handleMarkAllRead = () => {
    markAllMutation.mutate();
    toast('Toutes les notifications ont été marquées comme lues.', 'success');
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-text">Mes Notifications</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Restez informé sur le statut de vos covoiturages et demandes de réservation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {notifications.some((n) => !n.read) && (
            <Button
              onClick={handleMarkAllRead}
              variant="outline"
              size="sm"
            >
              Tout marquer lu
            </Button>
          )}
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Actualiser
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="flex flex-col gap-3">
          {notifications.map((notif) => {
            // Icon mapping
            let Icon = Info;
            let iconColor = 'text-primary bg-primary/10 border-primary/20';

            if (notif.type === 'RESERVATION_ACCEPTED') {
              Icon = CheckCircle;
              iconColor = 'text-accent bg-accent/10 border-accent/20';
            } else if (notif.type === 'RESERVATION_REJECTED') {
              Icon = XCircle;
              iconColor = 'text-danger bg-danger/10 border-danger/20';
            } else if (notif.type === 'TRIP_CANCELLED') {
              Icon = AlertTriangle;
              iconColor = 'text-warning bg-warning/10 border-warning/20';
            } else if (notif.type === 'RESERVATION_REQUEST') {
              Icon = Calendar;
              iconColor = 'text-primary bg-primary/10 border-primary/20';
            }

            const formattedTime = new Date(notif.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <Card
                key={notif.id}
                className={`p-4 border flex gap-4 items-start ${
                  notif.read ? 'bg-white opacity-85' : 'bg-primary/5 border-primary/15'
                }`}
              >
                <div className={`p-2 rounded-xl border shrink-0 ${iconColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between items-start gap-4">
                    <h4 className="text-xs font-bold text-text">{notif.title}</h4>
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0 capitalize">
                      {formattedTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {notif.message}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="py-20 text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold text-text">Aucune notification</h3>
            <p className="text-sm text-slate-500 font-medium max-w-sm">
              Vous êtes à jour ! Toutes les notifications s'afficheront ici.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
export default NotificationsPage;
