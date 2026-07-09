import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, User as UserIcon, Shield, ChevronDown, Car, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../ui/Avatar';
import { notificationService } from '../../services/notificationService';
import { useQuery } from '@tanstack/react-query';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch unread notifications count using TanStack Query
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['notifications_unread_count', user?.id],
    queryFn: () => (user ? notificationService.getUnreadCount(user.id) : 0),
    enabled: !!user,
    refetchInterval: 10000, // Poll every 10s for notifications
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  // Decide notification link based on role
  const notificationLink = user.role === 'ADMIN' 
    ? '/admin/notifications' 
    : user.role === 'CONDUCTEUR' 
      ? '/driver/notifications' 
      : '/passenger/notifications';

  return (
    <header className="sticky top-0 z-40 w-full glassmorphism border-b border-border px-4 lg:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center text-white font-black shadow-md group-hover:scale-105 transition-transform">
          CG
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          CovoitGo
        </span>
      </Link>

      {/* Action Area */}
      <div className="flex items-center gap-4">
        {/* Quick Search trigger for passenger */}
        {user.role === 'PASSAGER' && (
          <Link
            to="/passenger/search"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-border text-xs font-semibold text-slate-500 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            Rechercher un trajet...
          </Link>
        )}

        {/* Notifications Icon with Badge */}
        <Link
          to={notificationLink}
          className="relative p-2 rounded-2xl border border-border text-text hover:bg-slate-100 hover:text-primary transition-all duration-200"
          aria-label={`${unreadCount} notifications non lues`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse border border-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-2xl hover:bg-slate-100/80 transition-colors cursor-pointer select-none text-left"
          >
            <Avatar src={user.avatarUrl} name={user.name} size="sm" />
            <div className="hidden sm:flex flex-col pr-1">
              <span className="text-xs font-bold text-text leading-tight">{user.name}</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                {user.role === 'ADMIN' ? 'Admin' : user.role === 'CONDUCTEUR' ? 'Conducteur' : 'Passager'}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Animating Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-white p-2 shadow-premium text-sm text-text"
              >
                <div className="px-3 py-2.5 border-b border-slate-100 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rôles disponibles</p>
                  
                  {/* Dashboard Switches to test all flows */}
                  <div className="flex flex-col gap-1">
                    {user.role !== 'PASSAGER' && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          toast('Navigation vers le rôle Passager', 'success');
                          navigate('/passenger');
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 w-full text-left rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-primary" />
                        Tableau de bord Passager
                      </button>
                    )}
                    
                    {user.role !== 'CONDUCTEUR' && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          toast('Navigation vers le rôle Conducteur', 'success');
                          navigate('/driver');
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 w-full text-left rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
                      >
                        <Car className="w-3.5 h-3.5 text-accent" />
                        Tableau de bord Conducteur
                      </button>
                    )}

                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          toast('Navigation vers l\'administration', 'info');
                          navigate('/admin');
                        }}
                        className="flex items-center gap-2 px-2.5 py-1.5 w-full text-left rounded-xl hover:bg-slate-50 text-xs font-medium text-slate-600 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-warning" />
                        Espace Administrateur
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-1 flex flex-col gap-0.5 mt-1.5">
                  <Link
                    to={user.role === 'CONDUCTEUR' ? '/driver/profile' : '/passenger/profile'}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-50 font-medium transition-colors text-left"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    Mon Profil
                  </Link>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-danger font-medium transition-colors w-full text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-400 group-hover:text-danger" />
                    Se déconnecter
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
