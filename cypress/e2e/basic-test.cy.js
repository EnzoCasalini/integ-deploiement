describe('Test de base de l\'application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Charge la page d\'accueil sans erreurs', () => {
    cy.contains('Liste des Hunters').should('be.visible');
    cy.contains('Se connecter en tant qu\'admin').should('be.visible');
    cy.get('.user-card').should('have.length.greaterThan', 0);
  });

  it('Affiche le formulaire d\'inscription', () => {
    cy.get('#firstName').should('be.visible');
    cy.get('#lastName').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('#birthDate').should('be.visible');
    cy.get('#city').should('be.visible');
    cy.get('#postalCode').should('be.visible');
  });
}); 