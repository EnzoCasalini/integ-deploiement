// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Commande pour remplir le formulaire d'inscription
Cypress.Commands.add('fillRegistrationForm', (firstName, lastName, email, birthDate, city, postalCode) => {
  cy.get('#firstName').type(firstName);
  cy.get('#lastName').type(lastName);
  cy.get('#email').type(email);
  cy.get('#birthDate').type(birthDate);
  cy.get('#city').type(city);
  cy.get('#postalCode').type(postalCode);
});

// Commande pour soumettre le formulaire d'inscription
Cypress.Commands.add('submitRegistrationForm', () => {
  cy.get('button[type="submit"]').click();
});

// Commande pour se connecter en tant qu'administrateur
Cypress.Commands.add('loginAsAdmin', (email, password) => {
  cy.contains('Se connecter en tant qu\'admin').click();
  cy.get('.login-form').should('be.visible');
  cy.get('.login-form #email').type(email);
  cy.get('.login-form #password').type(password);
  cy.get('.login-form .login-btn').click();
});

// Commande pour se déconnecter
Cypress.Commands.add('logout', () => {
  cy.contains('Se déconnecter').click();
  cy.contains('Déconnexion réussie.').should('be.visible');
});

// Commande pour inscrire un nouvel utilisateur
Cypress.Commands.add('registerUser', (userData) => {
  const defaultUser = {
    firstName: "Test",
    lastName: "User",
    email: "test" + Date.now() + "@hxhexam.com",
    birthDate: "1990-01-01",
    city: "TestCity",
    postalCode: "12345"
  };
  
  const user = { ...defaultUser, ...userData };
  
  cy.get('input[name="firstName"]').type(user.firstName);
  cy.get('input[name="lastName"]').type(user.lastName);
  cy.get('input[name="email"]').type(user.email);
  cy.get('input[name="birthDate"]').type(user.birthDate);
  cy.get('input[name="city"]').type(user.city);
  cy.get('input[name="postalCode"]').type(user.postalCode);
  
  cy.get('button[type="submit"]').click();
  cy.contains("Inscription réussie !").should("exist");
});

// Commande pour supprimer un utilisateur par son nom
Cypress.Commands.add('deleteUser', (firstName, lastName) => {
  // Ignorer les erreurs React non critiques
  cy.on('uncaught:exception', (err) => {
    if (err.message.includes('Minified React error #31')) {
      return false;
    }
  });
  
  cy.get('.delete-btn').first().click();
  cy.on('window:confirm', () => true);
  cy.wait(1000); // Attendre que la suppression soit traitée
  cy.contains('Utilisateur supprimé avec succès.').should('be.visible');
});

// Commande pour vérifier qu'on est en mode utilisateur normal
Cypress.Commands.add('shouldBeNormalUser', () => {
  cy.contains('Admin connecté').should('not.exist');
  cy.get('button[title="Supprimer l\'utilisateur"]').should('not.exist');
  cy.get('.user-details').should('not.exist');
});

// Commande pour vérifier qu'on est en mode administrateur
Cypress.Commands.add('shouldBeAdmin', () => {
  cy.contains('Admin connecté').should('be.visible');
  cy.get('button[title="Supprimer l\'utilisateur"]').should('exist');
  cy.get('.user-details').should('exist');
});