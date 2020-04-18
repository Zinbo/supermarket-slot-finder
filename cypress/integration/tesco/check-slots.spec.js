/// <reference types="cypress" />

context('Asda', () => {
  beforeEach(() => {
    cy.visit('https://www.tesco.com/groceries/en-GB/slots/delivery');
  });

  // https://on.cypress.io/interacting-with-elements

  it('check if any delivery slot does not contain words "Sold Out"', async () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });
    const tescoEnvs = Cypress.env("tesco");
    const username = tescoEnvs.username;
    const password = tescoEnvs.password;
    cy.get('#username').type(username);
    cy.get('#password').type(password);
    cy.get('.ui-component__button')
      .contains('span', 'Sign in')
      .parent()
      .click();

    // set up twillio
    const twillioEnvs = Cypress.env('twillio');
    const client = require('twilio')(twillioEnvs.accountSid, twillioEnvs.authToken);

    await cy.get('.slot-selector--week-tabheader-link').each(async (slot) => {

      let waitLimit = 10;
      // wait for spinner to go away
      while((Cypress.$('.overlay-spinner--overlay open').length > 0) && waitLimit-- > 0) {
        console.log("waiting for spinner to disappear..."); 
        cy.wait(1000);
      }
      cy.wrap(slot).click();

      const slotAvailable = !Cypress.$('.book-a-slot--info-message')
          .text().includes('No slots available! Try another day');

      if(slotAvailable) {
          await client.messages
              .create({
                body: 'Tesco slot found!',
                from: twillioEnvs.fromNumber,
                to: twillioEnvs.toNumber
              });
          throw new Error('slot found - exiting test');
      }
    });
  });
});
