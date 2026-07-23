import React from 'react';
import { Navigate } from 'react-router-dom';

// Un composant de route protégée très simple
export default function ProtectedRoute({ children }) {
  // On récupère l'utilisateur stocké en format texte dans le localStorage
  const userJson = localStorage.getItem('user');

  // Si aucun utilisateur n'est connecté, on redirige vers la page de connexion
  if (!userJson) {
    return <Navigate to="/login" replace />;
  }

  // Sinon, on affiche le contenu de la page (children)
  return children;
}
