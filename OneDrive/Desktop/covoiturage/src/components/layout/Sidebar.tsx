import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, Search, Calendar, Bell, User, PlusCircle, Car, 
  Users, BarChart2, Shield, Menu, X 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return null;

  // Detect context dashboard from route
  const isDriverContext = location.pathname.startsWith('/driver');
  const isAdminContext = location.pathname.startsWith('/admin');

  // Define links based on active dashboard
  const passengerLinks = [
    { to: '/passenger', label: 'Accueil', icon: Home },
    { to: '/passenger/search', label: 'Trouver un trajet', icon: Search },
    { to: '/passenger/reservations', label: 'Mes réservations', icon: Calendar },
    { to: '/passenger/notifications', label: 'Notifications', icon: Bell },
    { to: '/passenger/profile', label: 'Mon Profil', icon: User },
  ];

  const driverLinks = [
    { to: '/driver', label: 'Accueil Conducteur', icon: Home },
    { to: '/driver/trips', label: 'Mes trajets proposés', icon: Car },
    { to: '/driver/trips/new', label: 'Créer un trajet', icon: PlusCircle },
    { to: '/driver/reservations', label: 'Demandes reçues', icon: Calendar },
    { to: '/driver/notifications', label: 'Notifications', icon: Bell },
    { to: '/driver/profile', label: 'Mon Profil', icon: User },
  ];

  const adminLinks = [
    { to: '/admin', label: 'Dashboard Admin', icon: Shield },
    { to: '/admin/users', label: 'Gestion Utilisateurs', icon: Users },
    { to: '/admin/trips', label: 'Supervision Trajets', icon: Car },
    { to: '/admin/statistics', label: 'Statistiques', icon: BarChart2 },
  ];

  const activeLinks = isAdminContext 
    ? adminLinks 
    : isDriverContext 
      ? driverLinks 
      : passengerLinks;

  const contextTitle = isAdminContext 
    ? 'Espace Admin' 
    : isDriverContext 
      ? 'Espace Conducteur' 
      : 'Espace Passager';

  const contextBgColor = isAdminContext
    ? 'bg-warning/10 text-warning border-warning/20'
    : isDriverContext
      ? 'bg-accent/10 text-accent border-accent/20'
      : 'bg-primary/10 text-primary border-primary/20';

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  return (
    <>
      {/* Mobile Sidebar Hamburger Trigger */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMobile}
          className="p-4 rounded-full bg-primary text-white shadow-lg cursor-pointer flex items-center justify-center"
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Wrapper */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-border flex flex-col justify-between p-5 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-[calc(100vh-70px)] shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section */}
        <div className="flex flex-col gap-6">
          {/* Active Context Indicator */}
          <div className={`px-4 py-2.5 rounded-2xl border text-center font-bold text-xs uppercase tracking-wider ${contextBgColor}`}>
            {contextTitle}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5" aria-label="Sidebar navigation">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/passenger' || link.to === '/driver' || link.to === '/admin'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-text'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Quick Info */}
        <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
          <Avatar src={user.avatarUrl} name={user.name} size="sm" />
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-bold text-text truncate leading-tight">{user.name}</span>
            <span className="text-[10px] font-semibold text-slate-400 truncate">{user.email}</span>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  );
};
