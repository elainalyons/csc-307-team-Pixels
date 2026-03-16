describe("Reflekt happy path", () => {
  it("logs in, creates an entry, views it, edits it, and checks calendar navigation", () => {
    const entryTitle = `Cypress Happy Path ${Date.now()}`;
    const entryBody =
      "This entry was created by the Cypress happy path test.";
    const updatedTitle = `${entryTitle} Updated`;
    const updatedBody =
      "This entry was updated by the Cypress happy path test.";

    cy.visit("http://localhost:5173/login");

    cy.get('[data-cy="login-username"]').type("isabelleford1");
    cy.get('[data-cy="login-password"]').type("123");
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("include", "/home");

    cy.get('[data-cy="home-editor-title"]', { timeout: 10000 })
      .should("be.visible")
      .and("not.be.disabled");

    cy.get('[data-cy="home-editor-title"]')
      .click()
      .type('{selectall}{backspace}')
      .type(entryTitle);

    cy.get('[data-cy="home-editor-body"]', { timeout: 10000 })
      .should("be.visible")
      .and("not.be.disabled");

    cy.get('[data-cy="home-editor-body"]')
      .click()
      .type('{selectall}{backspace}')
      .type(entryBody);

    cy.get('[data-cy="home-editor-save"]').click();

    cy.get('[data-cy="nav-all-entries"]').click();

    cy.contains("td", entryTitle).should("exist");

    cy.contains("td", entryTitle).click();

    cy.url().should("include", "/entries/");
    cy.get('[data-cy="entry-details-title"]').should(
      "contain",
      entryTitle
    );
    cy.get('[data-cy="entry-details-body"]').should(
      "contain",
      entryBody
    );

    cy.get('[data-cy="entry-details-back"]').click();

    cy.contains("td", entryTitle)
      .parents("tr")
      .first()
      .within(() => {
        cy.get('[data-cy="table-actions-button"]').click();
        cy.get('[data-cy="table-edit-button"]').click();
      });

    cy.get('[data-cy="table-edit-title"]')
      .clear()
      .type(updatedTitle);

    cy.get('[data-cy="table-edit-body"]')
      .clear()
      .type(updatedBody);

    cy.get('[data-cy="table-save-button"]').click();

    cy.contains("td", updatedTitle).should("exist");

    cy.get('[data-cy="nav-calendar"]').click();
    cy.url().should("include", "/calendar");
    cy.get('[data-cy="calendar-month-label"]').should(
      "exist"
    );
    cy.get('[data-cy="calendar-next-month"]').click();
    cy.get('[data-cy="calendar-prev-month"]').click();

    cy.get('[data-cy="nav-home"]').click();
    cy.url().should("include", "/home");

    cy.get('[data-cy="home-editor-title"]', { timeout: 10000 })
      .should("be.visible")
      .and("not.be.disabled")
      .and("have.value", updatedTitle);

    cy.get('[data-cy="home-editor-body"]', { timeout: 10000 })
      .should("be.visible")
      .and("not.be.disabled")
      .and("have.value", updatedBody);

    cy.get('[data-cy="nav-logout"]').click();
    cy.url().should("include", "/login");
  });
});