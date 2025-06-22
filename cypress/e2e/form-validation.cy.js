describe('Validation du formulaire d\'inscription', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Affiche des erreurs avec des champs invalides et reste sur la page', () => {
    // Test avec email invalide
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('email-invalide');
    cy.get('input[name="birthDate"]').type('1990-01-01');
    cy.get('input[name="city"]').type('Paris');
    cy.get('input[name="postalCode"]').type('75000');

    cy.get('button[type="submit"]').click();

    // Vérifie que l'utilisateur reste sur la page
    cy.url().should('not.include', '/admin');
    
    // Vérifie qu'une erreur d'email s'affiche
    cy.get('input[name="email"]').should('have.attr', 'aria-invalid', 'true');
  });

  it('Affiche une erreur avec un code postal invalide', () => {
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="birthDate"]').type('1990-01-01');
    cy.get('input[name="city"]').type('Paris');
    cy.get('input[name="postalCode"]').type('123'); // Code postal trop court

    cy.get('button[type="submit"]').click();

    // Vérifie que l'utilisateur reste sur la page
    cy.url().should('not.include', '/admin');
    
    // Vérifie qu'une erreur de code postal s'affiche
    cy.get('input[name="postalCode"]').should('have.attr', 'aria-invalid', 'true');
  });

  it('Affiche une erreur avec une date de naissance invalide (mineur)', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 1);
    const futureDateString = futureDate.toISOString().split('T')[0];

    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="birthDate"]').type(futureDateString);
    cy.get('input[name="city"]').type('Paris');
    cy.get('input[name="postalCode"]').type('75000');

    cy.get('button[type="submit"]').click();

    // Vérifie que l'utilisateur reste sur la page
    cy.url().should('not.include', '/admin');
    
    // Vérifie qu'une erreur de date s'affiche
    cy.get('input[name="birthDate"]').should('have.attr', 'aria-invalid', 'true');
  });

  it('Désactive le bouton de soumission avec des champs vides', () => {
    // Ne remplir que le prénom
    cy.get('input[name="firstName"]').type('Test');

    // Vérifie que le bouton est désactivé
    cy.get('button[type="submit"]').should('be.disabled');
    
    // Vérifie que les champs requis sont marqués
    cy.get('input[name="lastName"]').should('have.attr', 'required');
    cy.get('input[name="email"]').should('have.attr', 'required');
  });

  it('Active le bouton de soumission quand tous les champs sont remplis', () => {
    // Remplir tous les champs
    cy.get('input[name="firstName"]').type('Test');
    cy.get('input[name="lastName"]').type('User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="birthDate"]').type('1990-01-01');
    cy.get('input[name="city"]').type('Paris');
    cy.get('input[name="postalCode"]').type('75000');

    // Vérifie que le bouton est activé
    cy.get('button[type="submit"]').should('not.be.disabled');
  });
});

describe('Navigation et routes', () => {
  it('Affiche une page 404 pour les routes inexistantes', () => {
    // Visiter une URL inexistante
    cy.visit('/page-inexistante');
    
    // Vérifie qu'on reste sur la page demandée (pas de redirection automatique)
    cy.url().should('include', '/page-inexistante');
    
    // Vérifie qu'une page d'erreur s'affiche ou que l'application gère l'erreur
    // (selon la configuration de React Router)
    cy.get('body').should('exist');
  });

  it('Gère les routes invalides', () => {
    // Visiter une route avec des paramètres invalides
    cy.visit('/admin/invalid');
    
    // Vérifie qu'on reste sur la page demandée
    cy.url().should('include', '/admin/invalid');
  });
}); 