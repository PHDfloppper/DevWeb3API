export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Joueur: {
    Base: '/joueur',
    Get: '/all',
    GetById: '/:id',           // Recherche par ID
    GetByName: '/nom/:nom',
    GetByVersion: '/version/:version',  // Recherche par version
    Add: '/add',
    Update: '/update/:id',
    Delete: '/delete/:id',
  },
} as const;