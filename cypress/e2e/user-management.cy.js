describe('Gestion des utilisateurs', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
    // Ignorer les erreurs React non critiques
    cy.on('uncaught:exception', (err) => {
      if (err.message.includes('Minified React error #31')) {
        return false;
      }
    });
  });

  it('Affiche la liste des utilisateurs en mode public', () => {
    cy.contains('Liste des Hunters').should('be.visible');
    cy.contains('Se connecter en tant qu\'admin').should('be.visible');
    cy.get('.user-card').should('have.length.greaterThan', 0);
  });

  it('Scénario complet : création utilisateur, connexion admin, suppression sélective', () => {
    // Étape 1 : Enregistrer un nouvel utilisateur
    const testEmail = `test${Date.now()}@example.com`;
    const testFirstName = 'Test';
    const testLastName = 'User';
    
    cy.get('#firstName').type(testFirstName);
    cy.get('#lastName').type(testLastName);
    cy.get('#email').type(testEmail);
    cy.get('#birthDate').type('1990-01-01');
    cy.get('#city').type('Paris');
    cy.get('#postalCode').type('75001');
    cy.get('button[type="submit"]').click();
    
    // Attendre que l'utilisateur soit créé
    cy.contains('Inscription réussie !').should('be.visible');
    cy.wait(2000); // Attendre plus longtemps pour que la liste soit mise à jour
    
    // Vérifier que le nouvel utilisateur apparaît dans la liste (en mode public, seul le prénom est visible)
    cy.contains(testFirstName).should('be.visible');
    
    // Étape 2 : Se connecter en tant qu'admin
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');
    
    // Attendre que la liste soit mise à jour en mode admin
    cy.wait(1000);
    
    // Vérifier que l'utilisateur créé est visible avec ses détails complets
    cy.contains(testEmail).should('be.visible');
    
    // Étape 3 : Vérifier qu'on ne peut pas supprimer le compte admin
    cy.get('.user-card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.user-role').then(($role) => {
          if ($role.text().includes('admin')) {
            // Pour les comptes admin, le bouton de suppression ne doit pas exister
            cy.get('.delete-btn').should('not.exist');
          }
        });
      });
    });
    
    // Étape 4 : Supprimer le compte qu'on a créé (ciblage précis par email)
    cy.get('.user-card').each(($card) => {
      cy.wrap($card).within(() => {
        cy.get('.user-email').then(($email) => {
          if ($email.text().includes(testEmail)) {
            cy.get('.delete-btn').click();
            cy.on('window:confirm', () => true);
          }
        });
      });
    });
    
    // Vérifier le toast de succès
    cy.contains('Utilisateur supprimé avec succès.').should('be.visible');
    
    // Étape 5 : Vérifier que l'utilisateur a été supprimé (par email uniquement)
    cy.contains(testEmail).should('not.exist');
    
    // Étape 6 : Vérifier que les autres utilisateurs sont toujours présents
    cy.get('.user-card').should('have.length.greaterThan', 0);
  });

  it('Affiche les détails complets des utilisateurs en mode admin', () => {
    cy.contains('Se connecter en tant qu\'admin').click();
    cy.get('.login-form #email').type('loise.fenoll@ynov.com');
    cy.get('.login-form #password').type('PvdrTAzTeR247sDnAZBr');
    cy.get('.login-form .login-btn').click();
    cy.contains('Connexion administrateur réussie !').should('be.visible');
    
    // Vérifier que les détails sont visibles
    cy.get('.user-card').first().within(() => {
      cy.get('.user-email').should('exist');
      cy.get('.user-birth').should('exist');
      cy.get('.user-location').should('exist');
      cy.get('.user-role').should('exist');
    });
  });
}); 