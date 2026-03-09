// NOTE: This test relies on data-cy selectors in Login.jsx, HomeEditor.jsx, and MyApp.jsx.
// Do not remove those attributes or this test will fail.

describe("Reflekt happy path", () => {
  it("logs in and saves a journal entry for the selected date", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('[data-cy="login-username"]').type("isabelleford1");
    cy.get('[data-cy="login-password"]').type("123");
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("include", "/home");

    cy.get('[data-cy="home-editor-title"]')
      .clear()
      .type("Cypress Happy Path Entry");

    cy.get('[data-cy="home-editor-body"]')
      .clear()
      .type("This entry was saved by the Cypress happy path test.");

    cy.get('[data-cy="home-editor-save"]').click();

    cy.get('[data-cy="nav-all-entries"]').click();
    cy.contains("Cypress Happy Path Entry");

    cy.get('[data-cy="nav-home"]').click();
    cy.get('[data-cy="home-editor-title"]').should(
      "have.value",
      "Cypress Happy Path Entry"
    );
    cy.get('[data-cy="home-editor-body"]').should(
      "have.value",
      "This entry was saved by the Cypress happy path test."
    );
  });
});