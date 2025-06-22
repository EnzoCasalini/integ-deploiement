# Tests Cypress E2E

Ce dossier contient les tests end-to-end Cypress pour l'application React.

## Structure des tests

### Fichiers de test

- **`register.cy.js`** - Test d'inscription basique (existant)
- **`form-validation.cy.js`** - Tests de validation du formulaire et redirection
- **`admin-authentication.cy.js`** - Tests d'authentification administrateur
- **`user-management.cy.js`** - Tests de gestion des utilisateurs
- **`integration-flow.cy.js`** - Tests d'intégration complets
- **`simplified-tests.cy.js`** - Tests utilisant les commandes personnalisées

### Commandes personnalisées

Les commandes suivantes sont disponibles dans `support/commands.js` :

- `cy.loginAsAdmin(email, password)` - Se connecter en tant qu'administrateur
- `cy.logout()` - Se déconnecter
- `cy.registerUser(userData)` - Inscrire un nouvel utilisateur
- `cy.deleteUser(firstName, lastName)` - Supprimer un utilisateur
- `cy.shouldBeNormalUser()` - Vérifier qu'on est en mode utilisateur normal
- `cy.shouldBeAdmin()` - Vérifier qu'on est en mode administrateur

## Cas de test couverts

### 1. Validation du formulaire d'inscription
- ✅ Erreurs avec champs invalides (email, code postal, date)
- ✅ Vérification que l'utilisateur reste sur la page en cas d'erreur
- ✅ Validation des champs requis
- ✅ Correction des erreurs et nouvelle soumission

### 2. Redirection et navigation
- ✅ Redirection vers la page principale en cas de mauvaise URL
- ✅ Gestion des routes invalides

### 3. Authentification administrateur
- ✅ Connexion avec identifiants valides
- ✅ Erreurs avec identifiants invalides
- ✅ Validation des champs de connexion
- ✅ Fermeture du modal de connexion
- ✅ Déconnexion

### 4. Gestion des utilisateurs
- ✅ Impossibilité de supprimer en tant qu'utilisateur normal
- ✅ Suppression d'utilisateurs en tant qu'administrateur
- ✅ Annulation de suppression
- ✅ Affichage des détails complets en mode admin
- ✅ Affichage limité en mode utilisateur normal
- ✅ Protection des comptes administrateur
- ✅ Gestion de la liste vide

### 5. Tests d'intégration
- ✅ Flux complet : inscription → connexion admin → suppression
- ✅ Tests de sécurité
- ✅ Tests de persistance (reconnexion)
- ✅ Tests de validation avec correction

## Exécution des tests

### Prérequis
- Serveur React démarré sur `http://localhost:3000`
- Serveur backend démarré
- Base de données accessible

### Commandes

```bash
# Lancer tous les tests
npm run cypress:run

# Ouvrir l'interface Cypress
npm run cypress:open

# Lancer un fichier spécifique
npx cypress run --spec "cypress/e2e/form-validation.cy.js"
```

### Configuration

Les tests utilisent la configuration par défaut de Cypress. Assurez-vous que :
- L'URL de base est configurée sur `http://localhost:3000`
- Les identifiants admin sont corrects (`admin@hxh.com` / `admin123`)

## Notes importantes

1. **Données de test** : Les tests génèrent des emails uniques avec `Date.now()` pour éviter les conflits
2. **Nettoyage** : Les tests suppriment les utilisateurs créés pour maintenir un état propre
3. **Sélecteurs** : Les tests utilisent des sélecteurs CSS et de contenu pour identifier les éléments
4. **Assertions** : Vérification des messages de succès/erreur et des changements d'état de l'interface

## Maintenance

- Mettre à jour les identifiants admin si nécessaire
- Adapter les sélecteurs si l'interface change
- Ajouter de nouveaux cas de test selon les nouvelles fonctionnalités 