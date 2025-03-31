# 📝 Formulaire React – TP d’Intégration & Déploiement

Projet réalisé dans le cadre du TP “Intégration & Déploiement”.  
Objectif : construire un formulaire d’inscription React complet avec validation, tests, documentation, couverture, déploiement GitHub Pages et publication NPM.

---

## 🚀 Fonctionnalités

- Formulaire avec champs : **Nom**, **Prénom**, **Email**, **Date de naissance**, **Ville**, **Code postal**
- ✅ Validation des champs avec Zod
- ✅ Blocage des -18 ans
- ✅ Format email, nom/prénom, code postal
- ✅ Bouton "Sauvegarder" désactivé tant que tous les champs ne sont pas remplis
- ✅ Affichage des erreurs sous les champs
- ✅ Sauvegarde dans le `localStorage`
- ✅ Toasts de succès ou d’erreur avec `react-toastify`
- ✅ Réinitialisation du formulaire après enregistrement
- ✅ Couverture de tests **100%**
- ✅ Documentation technique générée avec `jsdoc`
- ✅ Déploiement automatique via GitHub Actions

---

## 🛠️ Stack technique

| Outil                         | Usage                                |
|------------------------------|--------------------------------------|
| **React 18.2.0**             | Framework front                      |
| **Vite**                     | Bundler / Dev Server                 |
| **react-hook-form**          | Gestion du formulaire                |
| **Zod**                      | Validation des données               |
| **react-toastify**           | Toasts (succès/erreur)               |
| **Vitest**                   | Tests unitaires et d’intégration    |
| **Testing Library**          | Tests orientés utilisateur           |
| **jsdoc**                    | Génération de documentation          |
| **GitHub Actions**           | CI (tests + déploiement)             |
| **GitHub Pages**             | Hébergement de l’application         |
| **Codecov**                  | Visualisation de la couverture       |

---

## 📦 Installation

```bash
npm install
```

---

## 🧪 Lancer les tests

```bash
npm run test
```

## 📈 Rapport de couverture

```bash
npm run coverage
```

Le rapport est généré dans `coverage/index.html`.  
📡 Couverture visible sur Codecov :  
👉 [Voir la couverture sur Codecov](https://app.codecov.io/gh/EnzoCasalini/integ-deploiement)

---

## 🌍 Déploiement

L'application est automatiquement déployée après tests réussis.  
👉 [Voir le site en ligne](https://enzocasalini.github.io/integ-deploiement/)

---

## 📚 Documentation technique

```bash
npm run jsdoc
```

Accessible ensuite ici :  
📁 `public/docs/index.html`

---

## 📤 Publication NPM

(Si publié)

```bash
npm install @<ton-profil-npm>/formulaire-react
```

---

## ✅ Tests couverts

| Test | Status |
|------|--------|
| Le calcul de l'âge | ✅ |
| L'âge > 18 ans | ✅ |
| Le format du code postal | ✅ |
| Le format des noms/prénoms (y compris accents/tirets) | ✅ |
| Le format de l’email | ✅ |
| Le bouton désactivé si les champs sont vides | ✅ |
| La sauvegarde dans le localStorage et le toaster de succès | ✅ |
| Le toaster d’erreur et erreurs sous les champs | ✅ |
| La disparition des erreurs quand corrigées | ✅ |

---

## ✍️ Auteur

Projet réalisé par **Enzo**
