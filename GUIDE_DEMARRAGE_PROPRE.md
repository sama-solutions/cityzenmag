# 🚀 Guide Démarrage Propre - CityzenMag

## 🎯 **Objectif**
Démarrer l'application en arrêtant automatiquement les processus existants sur le port 3002 pour éviter les conflits.

## ✅ **Scripts Disponibles**

### **1. Démarrage Standard**
```bash
npm start
```
- Démarre sur le port 3002
- Échoue si le port est occupé

### **2. Démarrage Propre (Recommandé)**
```bash
npm run start:force
```
- ✅ **Arrête automatiquement** les processus sur le port 3002
- ✅ **Démarre l'application** sur le port libéré
- ✅ **Gestion propre** des signaux d'arrêt

### **3. Démarrage Propre (Bash)**
```bash
npm run start:clean
```
- Version bash du script (Linux/Mac)
- Même fonctionnalité que `start:force`

## 🔧 **Fonctionnement du Script**

### **Étapes Automatiques**
1. **Vérification du port 3002**
   ```
   🔍 Vérification du port 3002...
   ```

2. **Arrêt des processus existants**
   ```
   ⚠️  Processus détectés sur le port 3002:
   🛑 Arrêt des processus...
      Arrêt du processus 12345
   ```

3. **Libération confirmée**
   ```
   ✅ Port 3002 libéré avec succès
   ```

4. **Démarrage de l'application**
   ```
   🚀 Démarrage de l'application...
   📱 URL: http://localhost:3002/
   🔧 Pour arrêter: Ctrl+C
   ```

### **Gestion des Erreurs**
- **Port libre** : Démarrage direct
- **Processus persistants** : Instructions manuelles
- **Arrêt propre** : Ctrl+C pour arrêter

## 📋 **Utilisation Recommandée**

### **Développement Quotidien**
```bash
# Démarrage propre recommandé
npm run start:force

# L'application démarre sur http://localhost:3002/
```

### **En Cas de Problème**
```bash
# Si le script échoue, arrêt manuel
sudo lsof -ti :3002 | xargs kill -9

# Puis démarrage normal
npm start
```

### **Vérification Manuelle**
```bash
# Voir les processus sur le port
lsof -i :3002

# Arrêter un processus spécifique
kill [PID]
```

## 🎯 **Avantages**

### **✅ Plus de Confusion**
- **Port unique** : Toujours 3002
- **Démarrage garanti** : Arrêt automatique des conflits
- **Documentation cohérente** : URLs toujours correctes

### **✅ Workflow Simplifié**
- **Une commande** : `npm run start:force`
- **Pas de vérification manuelle** : Script automatique
- **Arrêt propre** : Ctrl+C fonctionne correctement

### **✅ Robustesse**
- **Gestion d'erreurs** : Instructions claires en cas d'échec
- **Compatibilité** : Versions bash et Node.js
- **Signaux** : Gestion propre de SIGINT/SIGTERM

## 📊 **Comparaison des Méthodes**

| Commande | Port | Arrêt Auto | Gestion Erreurs | Recommandé |
|----------|------|------------|-----------------|------------|
| `npm start` | 3002 | ❌ | ❌ | Non |
| `npm run start:force` | 3002 | ✅ | ✅ | **Oui** |
| `npm run start:clean` | 3002 | ✅ | ✅ | Oui (Linux/Mac) |

## 🔍 **Diagnostic**

### **Si le Script Échoue**
```bash
# Vérifier les processus
lsof -i :3002

# Arrêt forcé si nécessaire
sudo lsof -ti :3002 | xargs kill -9

# Redémarrer
npm run start:force
```

### **Logs de Debug**
Le script affiche des logs détaillés :
- 🔍 Vérification du port
- ⚠️ Processus détectés
- 🛑 Arrêt en cours
- ✅ Port libéré
- 🚀 Démarrage application

## 🌐 **URLs Finales**

**Application** : http://localhost:3002/  
**Thread test** : http://localhost:3002/thread/test-thread-1  
**Test agrandissement** : Bouton sur page d'accueil

---

## 🎉 **Utilisation Recommandée**

```bash
# Démarrage quotidien
npm run start:force

# L'application démarre proprement sur http://localhost:3002/
# Plus de confusion de port !
```

**Status** : ✅ **DÉMARRAGE PROPRE OPÉRATIONNEL**  
**Commande** : `npm run start:force`  
**Port** : 3002 (garanti)  
**Avantage** : Aucun conflit de port

**Fini les problèmes de port occupé !** 🚀✨