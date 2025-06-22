describe('Flux d\'intégration complet', () => {
  beforeEach(() => {
    cy.visit('/');
    // Ignorer les erreurs React non critiques
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Minified React error #31')) {
        return false;
      }
    });
  });

  it('Flux complet : inscription, connexion admin, suppression', () => {
    // 1. Inscription d'un nouvel utilisateur
    const uniqueEmail = `test${Date.now()}@example.com`;
    cy.get('#firstName').type('Test');
    cy.get('#lastName').type('User');
    cy.get('#email').type(uniqueEmail);
    cy.get('#birthDate').type('1990-01-01');
    cy.get('#city').type('Paris');
    cy.get('#postalCode').type('75001');
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify__toast--success').should('be.visible');
    cy.get('.Toastify__toast--success').should('contain', 'Inscription réussie !');

    // 2. Connexion administrateur
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');

    // 3. Suppression de l'utilisateur créé
    cy.wait(1000); // Attendre que l'interface se mette à jour
    cy.get('.user-card').contains('Test').parent().parent().within(() => {
      cy.get('.delete-btn').click();
    });
    cy.on('window:confirm', () => true);
    cy.wait(1000); // Attendre que la suppression soit traitée
    // Vérifier que l'utilisateur a été supprimé
    cy.contains('Test').should('not.exist');
  });

  it('Test de persistance : reconnexion admin après déconnexion', () => {
    // 1. Connexion admin
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');

    // 2. Déconnexion
    cy.contains('Se déconnecter').click();
    cy.contains('Déconnexion réussie.').should('be.visible');

    // 3. Reconnexion
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');
  });

  it('Test de validation : formulaire avec données invalides puis correction', () => {
    // 1. Test avec données invalides
    cy.get('#firstName').type('T');
    cy.get('#lastName').type('U');
    cy.get('#email').type('invalid-email');
    cy.get('#birthDate').type('2025-01-01'); // Date future
    cy.get('#city').type('P');
    cy.get('#postalCode').type('123');
    
    // Soumettre le formulaire avec des données invalides
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify__toast--error').should('be.visible');
    cy.get('.Toastify__toast--error').should('contain', 'Veuillez corriger les erreurs.');

    // 2. Correction des données
    const uniqueEmail = `test${Date.now()}@example.com`;
    cy.get('#firstName').clear().type('Test');
    cy.get('#lastName').clear().type('User');
    cy.get('#email').clear().type(uniqueEmail);
    cy.get('#birthDate').clear().type('1990-01-01');
    cy.get('#city').clear().type('Paris');
    cy.get('#postalCode').clear().type('75001');
    
    // Le bouton devrait maintenant être activé
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.get('button[type="submit"]').click();
    cy.get('.Toastify__toast--success').should('be.visible');
    cy.get('.Toastify__toast--success').should('contain', 'Inscription réussie !');
  });

  it('Test de navigation : redirection vers la page d\'accueil', () => {
    // Aller sur une URL invalide
    cy.visit('/invalid-page');
    
    // Vérifier qu'on est redirigé vers la page d'accueil
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    // Vérifier que la page d'accueil s'affiche correctement
    cy.contains('Liste des Hunters').should('be.visible');
  });

  it('Test de gestion des erreurs serveur', () => {
    // Tenter une connexion admin avec des identifiants invalides
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form #email').type('fake@admin.com');
    cy.get('.login-form #password').type('wrongpassword');
    cy.get('.login-form .login-btn').click();
    
    // Attendre et vérifier l'erreur
    cy.wait(1000);
    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });
}); 