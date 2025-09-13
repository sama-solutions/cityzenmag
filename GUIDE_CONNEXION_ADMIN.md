# 🔐 Guide de Connexion Administration - CityzenMag

## 🎯 **Accès Administration**

**URL** : http://localhost:3002/admin/login

## 🔑 **Identifiants Valides**

### **Option 1 : Email .com**
- **Email** : `admin@cityzenmag.com`
- **Mot de passe** : `admin123`

### **Option 2 : Email .sn**
- **Email** : `admin@cityzenmag.sn`
- **Mot de passe** : `admin123`

### **Option 3 : Mot de passe court**
- **Email** : `admin@cityzenmag.com` ou `admin@cityzenmag.sn`
- **Mot de passe** : `admin`

## 🚀 **Procédure de Connexion**

### Étape 1 : Accès à la page de connexion
1. **Ouvrir** : http://localhost:3002/admin/login
2. **Vérifier** que la page de connexion s'affiche

### Étape 2 : Saisie des identifiants
1. **Email** : Saisir `admin@cityzenmag.sn`
2. **Mot de passe** : Saisir `admin123` ou `admin`
3. **Cliquer** sur "Se connecter"

### Étape 3 : Redirection automatique
1. **Redirection** vers `/admin` (dashboard)
2. **Vérification** de l'accès aux fonctionnalités

## 🛠️ **Fonctionnalités Administration**

### **Dashboard Principal** (`/admin`)
- Vue d'ensemble des statistiques
- Métriques de contenu
- Activité récente

### **Gestion des Catégories** (`/admin/categories`)
- Création/modification des catégories
- Organisation du contenu

### **Gestion du Contenu** (`/admin/content`)
- Articles et threads Twitter
- Modération des contenus

### **Planificateur** (`/admin/scheduler`)
- Programmation des publications
- Calendrier éditorial

### **Gestion des Menus** (`/admin/menus`)
- Configuration de la navigation
- Structure des menus

### **Analytics** (`/admin/analytics`)
- Métriques détaillées
- Performance des contenus
- Statistiques utilisateurs

## 🔧 **Dépannage**

### **Problème : "Identifiants incorrects"**
**Solutions** :
1. **Vérifier l'email** : Utiliser `admin@cityzenmag.sn`
2. **Vérifier le mot de passe** : Utiliser `admin123` ou `admin`
3. **Effacer le cache** : Ctrl+F5 pour recharger
4. **Vérifier la casse** : Tout en minuscules

### **Problème : Page ne se charge pas**
**Solutions** :
1. **Vérifier l'URL** : http://localhost:3002/admin/login
2. **Redémarrer le serveur** : `npm start`
3. **Vérifier le port** : 3002 doit être libre

### **Problème : Redirection après connexion**
**Solutions** :
1. **Attendre** la redirection automatique
2. **Naviguer manuellement** vers `/admin`
3. **Vérifier localStorage** : Données de session

## 🎨 **Interface Administration**

### **Sidebar Navigation**
- **Dashboard** : Vue d'ensemble
- **Catégories** : Gestion taxonomie
- **Contenu** : Modération articles
- **Planificateur** : Calendrier éditorial
- **Menus** : Configuration navigation
- **Analytics** : Métriques avancées

### **Thèmes Disponibles**
- **Sénégalais** : Couleurs chaudes, dégradés culturels
- **Minimaliste** : Interface épurée, noir et blanc

### **Fonctionnalités Avancées**
- **Sélecteur de thème** intégré
- **Navigation responsive**
- **Déconnexion sécurisée**
- **Persistance de session**

## 📊 **Données de Test**

### **Contenu Disponible**
- **Articles Twitter** : Threads synchronisés
- **Interviews** : 6 interviews de démonstration
- **Reportages** : 5 reportages photo
- **Vidéos** : 5 analyses vidéo
- **Témoignages** : 7 témoignages citoyens

### **Métriques Analytics**
- **Utilisateurs actifs** : Données simulées
- **Pages vues** : Tracking automatique
- **Engagement** : Métriques de performance
- **Recommandations** : Algorithmes IA

## 🚀 **Après Connexion**

### **Première Visite**
1. **Explorer** le dashboard principal
2. **Tester** la navigation sidebar
3. **Vérifier** les différentes sections
4. **Changer** de thème pour tester

### **Fonctionnalités à Tester**
1. **Analytics** : Métriques et graphiques
2. **Contenu** : Gestion des articles
3. **Menus** : Configuration navigation
4. **Thèmes** : Changement visuel

### **Déconnexion**
1. **Cliquer** sur "Déconnexion" dans la sidebar
2. **Confirmation** de déconnexion
3. **Redirection** vers page de connexion

---

**Status** : ✅ **IDENTIFIANTS MULTIPLES CONFIGURÉS**  
**Emails valides** : `admin@cityzenmag.com` et `admin@cityzenmag.sn`  
**Mots de passe** : `admin123` et `admin`  
**URL Admin** : http://localhost:3002/admin/login

**Connexion maintenant possible avec vos identifiants !** 🎉