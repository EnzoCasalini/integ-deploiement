describe('Formulaire d\'inscription', () => {
    const user = {
      firstName: "Leorio",
      lastName: "Paradinight",
      email: "leorio" + Date.now() + "@hxhexam.com", // pour éviter les doublons
      birthDate: "1990-01-01",
      city: "Yorkshin",
      postalCode: "69000"
    };
  
    it('Remplit le formulaire et voit l\'utilisateur apparaître dans la liste', () => {
      cy.visit('http://localhost:3000'); // Ou URL de ton front déployé
  
      // Remplir le formulaire
      cy.get('input[name="lastName"]').type(user.lastName);
      cy.get('input[name="firstName"]').type(user.firstName);
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="birthDate"]').type(user.birthDate);
      cy.get('input[name="city"]').type(user.city);
      cy.get('input[name="postalCode"]').type(user.postalCode);
  
      cy.get('button[type="submit"]').click();
  
      // Attendre toast de succès
      cy.contains("Inscription réussie !").should("exist");
  
      // Vérifie que l'utilisateur est dans la liste publique
      cy.contains(user.firstName).should("exist");
    });
});