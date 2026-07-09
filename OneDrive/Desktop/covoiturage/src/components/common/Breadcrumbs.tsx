import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Define French labels for route segments
  const labels: Record<string, string> = {
    passenger: 'Passager',
    driver: 'Conducteur',
    admin: 'Administration',
    search: 'Recherche',
    trips: 'Trajets',
    new: 'Nouveau trajet',
    edit: 'Modifier',
    reservations: 'Réservations',
    notifications: 'Notifications',
    profile: 'Profil',
    users: 'Utilisateurs',
    statistics: 'Statistiques'
  };

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 py-2 select-none" aria-label="Breadcrumb">
      <Link
        to={pathnames[0] === 'driver' ? '/driver' : pathnames[0] === 'admin' ? '/admin' : '/passenger'}
        className="flex items-center gap-1 text-slate-400 hover:text-primary transition-colors duration-150"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>
      
      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        // Ignore IDs in breadcrumbs or replace them
        const label = labels[value] || (value.startsWith('trip-') || value.startsWith('res-') || value.startsWith('user-') ? 'Détails' : value);

        return (
          <React.Fragment key={to}>
            <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />
            {isLast ? (
              <span className="text-slate-800 font-bold truncate max-w-[150px]">{label}</span>
            ) : (
              <Link
                to={to}
                className="hover:text-primary transition-colors duration-150 truncate max-w-[150px]"
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
