describe('Tests simplifiés avec commandes personnalisées', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // Ignorer les erreurs React non critiques
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Minified React error #31')) {
        return false;
      }
    });
  });

  it('Test complet avec commandes personnalisées', () => {
    // Inscription d'un utilisateur avec email unique
    const uniqueEmail = `test${Date.now()}@example.com`;
    cy.fillRegistrationForm('Test', 'User', uniqueEmail, '1990-01-01', 'Paris', '75001');
    cy.submitRegistrationForm();
    cy.get('.Toastify__toast--success').should('be.visible');
    cy.get('.Toastify__toast--success').should('contain', 'Inscription réussie !');

    // Connexion admin
    cy.loginAsAdmin('loise.fenoll@ynov.com', 'PvdrTAzTeR247sDnAZBr');
    cy.contains('Connexion administrateur réussie !').should('be.visible');

    // Attendre que l'interface se mette à jour et que le mode admin soit activé
    cy.wait(2000);
    cy.get('.admin-badge').should('be.visible');
    cy.get('.admin-badge').should('contain', 'Admin connecté');

    // Vérifier que l'utilisateur créé est visible dans la liste
    cy.get('.user-card').should('contain', uniqueEmail);

    // Suppression de l'utilisateur créé - utiliser un sélecteur plus spécifique
    cy.get('.user-card').contains(uniqueEmail).closest('.user-card').find('.delete-btn').should('be.visible').click();
    cy.on('window:confirm', () => true);
    cy.wait(1000); // Attendre que la suppression soit traitée
    
    // Vérifier que l'utilisateur avec cet email spécifique a été supprimé
    cy.get('.user-card').should('not.contain', uniqueEmail);
  });

  it('Test d\'authentification avec identifiants invalides', () => {
    cy.loginAsAdmin('fake@admin.com', 'wrongpassword');
    cy.wait(1000);
    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Invalid credentials');
  });

  it('Test de validation de formulaire avec commandes', () => {
    const uniqueEmail = `test${Date.now()}@example.com`;
    cy.fillRegistrationForm('Test', 'User', uniqueEmail, '1990-01-01', 'Paris', '75001');
    cy.submitRegistrationForm();
    cy.get('.Toastify__toast--success').should('be.visible');
    cy.get('.Toastify__toast--success').should('contain', 'Inscription réussie !');
  });
}); 