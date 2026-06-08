# Dashboard admin — MAI Tourisme

## Dépendances frontend

À la racine de `frontend/` :

```bash
npm install
```

Le `package.json` inclut **`xlsx`** (export Excel). Les icônes du dashboard sont en **SVG local** (`src/admin/icons/AdminIcons.jsx`), sans paquet `react-icons`.

## Arborescence

```
src/admin/
├── components/       # Sidebar, Topbar, StatsCards, FilterBar, MessagesTable, ReservationsTable, …
├── data/             # Constantes statuts (NOUVEAU / EN_COURS / TRAITE)
├── layouts/          # AdminLayout (sidebar + topbar + <Outlet />)
├── pages/            # DashboardMessages (onglets contact + réservations site)
└── services/         # contactService, websiteReservationService
```

## Routes

- `/admin/login` — connexion email + mot de passe (JWT staff)
- `/admin` → redirection vers `/admin/messages`
- `/admin/messages` — **admin + managers** : messages contact et réservations site
- `/admin/managers` — **admin seul** : créer / modifier / supprimer les 2 managers max
- `/admin/destinations` — **admin + managers** : catalogue destinations (CRUD API)
- `/admin/hotels` — **admin + managers** : hôtels partenaires (CRUD API)
- `/admin/packages` — **admin + managers** : forfaits/circuits (CRUD API)

Les routes admin sont **hors** `MainLayout` (pas de navbar/footer public).

## Rôles & comptes de démo

| Rôle | Email | Mot de passe | Accès |
|------|-------|--------------|--------|
| Admin | `admin@maitourism.ma` | `maitourism2025` | Inbox + managers + destinations + hôtels + forfaits |
| Manager 1 | `manager1@maitourism.ma` | `manager2025` | Inbox + destinations + hôtels + forfaits |
| Manager 2 | `manager2@maitourism.ma` | `manager2025` | Inbox + destinations + hôtels + forfaits |

Connexion : `POST /api/auth/staff/login` → token Bearer (stocké en session).

## API Spring Boot

- `POST /api/auth/staff/login` — admin / manager
- `GET|POST|PUT|DELETE /api/admin/managers` — admin uniquement
- `GET /api/destinations` — public ; `POST|PUT|DELETE` — admin + manager
- `GET /api/hotels` — public ; `POST|PUT|DELETE` — admin + manager
- `GET /api/packages` — public ; `POST|PUT|DELETE` — admin + manager
- `POST /api/uploads/destination-image` — envoi photo (multipart, max 5 Mo) — admin + manager
- `GET /uploads/**` — fichiers enregistrés sur le serveur (`backend/uploads/`)
- `GET|PATCH|DELETE /api/contacts[...]` — admin + manager (JWT)
- `GET|PATCH|DELETE /api/public-reservations[...]` — admin + manager (JWT)

Le site public charge les destinations depuis `GET /api/destinations` (repli sur `mockData` si l’API est indisponible).

Après mise à jour du backend, relancer l’API ; le `DataInitializer` crée admin, managers et destinations si la base est vide.
