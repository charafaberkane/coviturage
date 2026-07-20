### Requêtes Postman — API Covoiturage

Vous trouverez ci-dessous la liste des requêtes HTTP pour tester chaque endpoint du backend.

#### Collection Variables globales
- `{{base_url}}` = `http://localhost:5000/api`
- `{{token}}` = Token JWT obtenu suite à l'inscription ou la connexion (à placer dans l'onglet **Authorization** -> **Bearer Token**).

---

### Étape 2 — Authentification

#### 1. Inscription (Passager ou Conducteur)
- **Méthode** : `POST`
- **URL** : `{{base_url}}/auth/inscription`
- **Body (JSON)** :
```json
{
  "nom": "Jean Dupont",
  "email": "jean.dupont@covoit.com",
  "mot_de_passe": "password123",
  "role": "PASSAGER"
}
```

#### 2. Connexion
- **Méthode** : `POST`
- **URL** : `{{base_url}}/auth/connexion`
- **Body (JSON)** :
```json
{
  "email": "jean.dupont@covoit.com",
  "mot_de_passe": "password123"
}
```

#### 3. Obtenir l'utilisateur connecté
- **Méthode** : `GET`
- **URL** : `{{base_url}}/auth/me`
- **Headers** : `Authorization: Bearer {{token}}`

---

### Étape 3 — Gestion des utilisateurs

#### 1. Voir son profil
- **Méthode** : `GET`
- **URL** : `{{base_url}}/users/profil`
- **Headers** : `Authorization: Bearer {{token}}`

#### 2. Modifier son profil
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/users/profil`
- **Headers** : `Authorization: Bearer {{token}}`
- **Body (JSON)** :
```json
{
  "nom": "Jean D. Dupont",
  "telephone": "0601020304",
  "bio": "Adepte du covoiturage quotidien !"
}
```

#### 3. Devenir Conducteur
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/users/devenir-conducteur`
- **Headers** : `Authorization: Bearer {{token}}`

#### 4. [Admin] Lister tous les utilisateurs
- **Méthode** : `GET`
- **URL** : `{{base_url}}/users`
- **Headers** : `Authorization: Bearer {{token_admin}}`

#### 5. [Admin] Activer/Désactiver un compte
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/users/2/toggle-actif`
- **Headers** : `Authorization: Bearer {{token_admin}}`
- **Body (JSON)** :
```json
{
  "est_actif": false
}
```

---

### Étape 4 — Gestion des trajets

#### 1. Créer un trajet (Nécessite le rôle CONDUCTEUR)
- **Méthode** : `POST`
- **URL** : `{{base_url}}/trips`
- **Headers** : `Authorization: Bearer {{token}}`
- **Body (JSON)** :
```json
{
  "depart": "Montréal",
  "destination": "Québec",
  "date_heure": "2026-08-15T08:00:00Z",
  "places_totales": 4,
  "prix": 25.00,
  "description": "Voyage tranquille, départ tôt le matin.",
  "modele_voiture": "Tesla Model 3"
}
```

#### 2. Rechercher des trajets (Filtres optionnels)
- **Méthode** : `GET`
- **URL** : `{{base_url}}/trips?depart=Montréal&destination=Québec&date=2026-08-15&places=1`
- **Headers** : `Authorization: Bearer {{token}}`

#### 3. Voir les détails d'un trajet
- **Méthode** : `GET`
- **URL** : `{{base_url}}/trips/1`
- **Headers** : `Authorization: Bearer {{token}}`

#### 4. Voir ses trajets créés (Conducteur)
- **Méthode** : `GET`
- **URL** : `{{base_url}}/trips/mes/conducteur`
- **Headers** : `Authorization: Bearer {{token}}`

#### 5. Modifier un trajet
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/trips/1`
- **Headers** : `Authorization: Bearer {{token}}`
- **Body (JSON)** :
```json
{
  "depart": "Montréal",
  "destination": "Québec",
  "date_heure": "2026-08-15T09:00:00Z",
  "places_totales": 3,
  "prix": 20.00
}
```

#### 6. Annuler un trajet (Notifie les passagers)
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/trips/1/annuler`
- **Headers** : `Authorization: Bearer {{token}}`

---

### Étape 5 — Réservations

#### 1. Créer une demande de réservation (Passager)
- **Méthode** : `POST`
- **URL** : `{{base_url}}/reservations`
- **Headers** : `Authorization: Bearer {{token}}`
- **Body (JSON)** :
```json
{
  "trajet_id": 1,
  "nombre_places": 2
}
```

#### 2. Voir l'historique de ses réservations (Passager)
- **Méthode** : `GET`
- **URL** : `{{base_url}}/reservations/mes-reservations`
- **Headers** : `Authorization: Bearer {{token}}`

#### 3. Voir les demandes reçues (Conducteur)
- **Méthode** : `GET`
- **URL** : `{{base_url}}/reservations/conducteur`
- **Headers** : `Authorization: Bearer {{token}}`

#### 4. Accepter une réservation (Conducteur)
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/reservations/1/accepter`
- **Headers** : `Authorization: Bearer {{token}}`

#### 5. Refuser une réservation (Conducteur)
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/reservations/1/refuser`
- **Headers** : `Authorization: Bearer {{token}}`

#### 6. Annuler une réservation (Passager)
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/reservations/1/annuler`
- **Headers** : `Authorization: Bearer {{token}}`

---

### Étape 6 — Notifications

#### 1. Récupérer ses notifications
- **Méthode** : `GET`
- **URL** : `{{base_url}}/notifications`
- **Headers** : `Authorization: Bearer {{token}}`

#### 2. Marquer une notification comme lue
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/notifications/1/lire`
- **Headers** : `Authorization: Bearer {{token}}`

#### 3. Tout marquer comme lu
- **Méthode** : `PUT`
- **URL** : `{{base_url}}/notifications/tout-lire`
- **Headers** : `Authorization: Bearer {{token}}`

---

### Étape 7 — Statistiques (Admin)

#### 1. Obtenir le tableau de bord des statistiques
- **Méthode** : `GET`
- **URL** : `{{base_url}}/stats`
- **Headers** : `Authorization: Bearer {{token_admin}}`
