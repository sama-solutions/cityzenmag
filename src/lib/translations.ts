// Traductions françaises pour CityzenMag
export const translations = {
  // Navigation et interface générale
  'Something went wrong': 'Une erreur s\'est produite',
  'Loading': 'Chargement',
  'Error': 'Erreur',
  'Back': 'Retour',
  'Search': 'Rechercher',
  'View': 'Voir',
  'Show': 'Afficher',
  'Hide': 'Masquer',
  'Edit': 'Modifier',
  'Delete': 'Supprimer',
  'Save': 'Enregistrer',
  'Cancel': 'Annuler',
  'Submit': 'Valider',
  'Login': 'Connexion',
  'Logout': 'Déconnexion',
  
  // Messages d'erreur
  'Thread not found': 'Article introuvable',
  'No threads found': 'Aucun article trouvé',
  'Failed to load': 'Échec du chargement',
  'Connection error': 'Erreur de connexion',
  
  // Interface utilisateur
  'Search articles': 'Rechercher des articles',
  'Filter by category': 'Filtrer par catégorie',
  'Sort by date': 'Trier par date',
  'Grid view': 'Vue grille',
  'List view': 'Vue liste',
  'Show filters': 'Afficher les filtres',
  'Clear filters': 'Effacer les filtres',
  
  // Articles et contenus
  'Complete thread': 'Dossier complet',
  'Partial thread': 'En cours',
  'Read more': 'Lire la suite',
  'Share': 'Partager',
  'Like': 'J\'aime',
  'Comment': 'Commenter',
  
  // Administration
  'Admin Dashboard': 'Tableau de bord',
  'Manage Categories': 'Gérer les catégories',
  'Manage Content': 'Gérer le contenu',
  'Settings': 'Paramètres',
  'Users': 'Utilisateurs',
  
  // Nouvelles fonctionnalités
  'Propose a debate': 'Proposer un débat',
  'Share your story': 'Partagez votre histoire',
  'Join debate': 'Rejoindre le débat',
  'Start livestream': 'Démarrer le direct',
  'End livestream': 'Terminer le direct',
  
  // Formulaires
  'Name': 'Nom',
  'Email': 'Email',
  'Message': 'Message',
  'Subject': 'Sujet',
  'Description': 'Description',
  'Category': 'Catégorie',
  'Tags': 'Étiquettes',
  'Publish': 'Publier',
  'Draft': 'Brouillon',
  
  // Statuts
  'Published': 'Publié',
  'Draft': 'Brouillon',
  'Archived': 'Archivé',
  'Pending': 'En attente',
  'Active': 'Actif',
  'Inactive': 'Inactif'
}

// Fonction utilitaire pour traduire
export function t(key: string): string {
  return translations[key as keyof typeof translations] || key
}