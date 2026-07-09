import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserX, UserCheck, RefreshCw, Mail, Phone } from 'lucide-react';
import { userService } from '../../services/userService';
import { adminService } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { Avatar } from '../../components/ui/Avatar';

export const ManageUsersPage: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading, refetch } = useQuery({
    queryKey: ['admin_users_list'],
    queryFn: userService.getUsersList,
  });

  // Toggle user status mutation
  const toggleMutation = useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminService.toggleUserStatus(userId, isActive),
    onSuccess: (data) => {
      toast(
        `Le compte de ${data.name} a été ${data.isActive ? 'réactivé' : 'suspendu'} avec succès.`,
        data.isActive ? 'success' : 'warning'
      );
      queryClient.invalidateQueries({ queryKey: ['admin_users_list'] });
      queryClient.invalidateQueries({ queryKey: ['admin_stats'] });
    },
    onError: (err: any) => {
      toast(err.message || 'Erreur lors de la mise à jour.', 'error');
    },
  });

  const handleToggleStatus = (userId: string, currentStatus: boolean) => {
    toggleMutation.mutate({ userId, isActive: !currentStatus });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 text-left pb-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-text">Gestion des Utilisateurs</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Activez ou désactivez les comptes des utilisateurs de la plateforme de covoiturage.
          </p>
        </div>

        <Button
          onClick={() => refetch()}
          variant="outline"
          size="sm"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
        >
          Actualiser
        </Button>
      </div>

      {/* Users table */}
      <Card className="overflow-hidden p-0 border border-border rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-semibold text-slate-500">
            <thead>
              <tr className="bg-slate-50 text-text border-b border-border text-[10px] uppercase tracking-wider font-extrabold">
                <th className="py-4 px-5">Utilisateur</th>
                <th className="py-4 px-5">Rôle</th>
                <th className="py-4 px-5">Coordonnées</th>
                <th className="py-4 px-5">Statut</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100">
              {users.map((item) => {
                const isUserActive = item.isActive;
                
                // Role Badge Map
                const roleBadgeMap: Record<string, 'primary' | 'accent' | 'warning'> = {
                  ADMIN: 'warning',
                  CONDUCTEUR: 'accent',
                  PASSAGER: 'primary',
                };

                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-5 flex items-center gap-3">
                      <Avatar src={item.avatarUrl} name={item.name} size="sm" />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text">{item.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold">ID: {item.id}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <Badge variant={roleBadgeMap[item.role] || 'primary'} className="text-[9px] uppercase font-bold px-2 py-0">
                        {item.role}
                      </Badge>
                    </td>

                    <td className="py-4 px-5">
                      <div className="flex flex-col gap-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {item.email}
                        </span>
                        {item.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {item.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-5">
                      <Badge variant={isUserActive ? 'accent' : 'slate'} className="text-[9px] uppercase font-bold px-2 py-0">
                        {isUserActive ? 'Actif' : 'Suspendu'}
                      </Badge>
                    </td>

                    <td className="py-4 px-5 text-right">
                      {item.role !== 'ADMIN' ? (
                        <Button
                          onClick={() => handleToggleStatus(item.id, isUserActive)}
                          disabled={toggleMutation.isPending}
                          variant={isUserActive ? 'outline' : 'primary'}
                          size="sm"
                          leftIcon={isUserActive ? <UserX className="w-3.5 h-3.5 text-danger" /> : <UserCheck className="w-3.5 h-3.5 text-accent" />}
                          className={`text-xs ${
                            isUserActive 
                              ? 'text-danger border-red-100 hover:bg-red-50 hover:border-red-300' 
                              : ''
                          }`}
                        >
                          {isUserActive ? 'Suspendre' : 'Réactiver'}
                        </Button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic font-medium pr-4">
                          Non modifiable
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default ManageUsersPage;
