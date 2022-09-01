describe("Log In", () => {
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Ruber Eats");
  });

  it("can fill out the form", () => {
    cy.visit("/")
      .get("body")
      .findByPlaceholderText(/email/i)
      .type("testadmin@gmail.com")

      .get("body")
      .findByPlaceholderText(/password/i)
      .type("tjdgus123")

      .get("body")
      .findByRole("button")
      .should("not.have.class", "pointer-events-none");
    // todo (can log in)
  });

  it("can see email / password validation errors", () => {
    cy.visit("/")
      .get("body")
      .findByPlaceholderText(/email/i)
      .type("bad@email")

      .get("body")
      .findByRole("alert")
      .should("have.text", "Please enter a valid email");
  });
});
