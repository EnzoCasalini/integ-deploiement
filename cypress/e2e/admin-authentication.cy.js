describe('Authentification administrateur', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Se connecte en tant qu\'administrateur avec des identifiants valides', () => {
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form').should('be.visible');
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');
    cy.contains('Admin connecté').should('be.visible');
    cy.contains('Se déconnecter').should('be.visible');
  });

  it('Affiche une erreur avec des identifiants invalides', () => {
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form').should('be.visible');
    cy.get('.login-form #email').type('fake@admin.com');
    cy.get('.login-form #password').type('wrongpassword');
    cy.get('.login-form .login-btn').click();
    cy.wait(1000);
    cy.get('.error-message').should('be.visible');
    cy.get('.error-message').should('contain', 'Invalid credentials');
    cy.contains('Connexion Administrateur').should('be.visible');
    cy.contains('Admin connecté').should('not.exist');
  });

  it('Ferme le modal de connexion', () => {
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form').should('be.visible');
    cy.get('.modal-close').click();
    cy.contains('Connexion Administrateur').should('not.exist');
  });

  it('Se déconnecte correctement', () => {
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form').should('be.visible');
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');
    cy.contains('Se déconnecter').click();
    cy.contains('Déconnexion réussie.').should('be.visible');
    cy.contains('Admin connecté').should('not.exist');
    cy.contains('Se connecter en tant qu\'admin').should('be.visible');
  });

  it('Vide les champs du formulaire lors de la fermeture du modal', () => {
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form').should('be.visible');
    
    // Remplir les champs
    cy.get('.login-form #email').type('test@admin.com');
    cy.get('.login-form #password').type('testpassword');
    
    // Vérifier que les champs sont remplis
    cy.get('.login-form #email').should('have.value', 'test@admin.com');
    cy.get('.login-form #password').should('have.value', 'testpassword');
    
    // Fermer le modal
    cy.get('.modal-close').click();
    cy.contains('Connexion Administrateur').should('not.exist');
    
    // Rouvrir le modal et vérifier que les champs sont vides
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form').should('be.visible');
    cy.get('.login-form #email').should('have.value', '');
    cy.get('.login-form #password').should('have.value', '');
  });

  it('Vide les champs du formulaire après une déconnexion', () => {
    // Se connecter en tant qu'admin
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');
    
    // Se déconnecter
    cy.contains('Se déconnecter').click();
    cy.contains('Déconnexion réussie.').should('be.visible');
    
    // Rouvrir le modal et vérifier que les champs sont vides
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form').should('be.visible');
    cy.get('.login-form #email').should('have.value', '');
    cy.get('.login-form #password').should('have.value', '');
  });
}); 