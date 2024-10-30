/**
 * Express router paths go here.
 */


export default {
  Base: '/api',
  Users: {
    Base: '/users',
    Get: '/all',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  },
  Joueur:{
    Base: '/joueur',
    Get: '/all',
    GetByName: '/:nom',
    Add: '/add',
    Update: '/update',
    Delete: '/delete/:id',
  }
} as const;
