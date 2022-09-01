declare namespace Cypress {
  interface Chainable {
    assertLoggedIn(): void;
    assertLoggedOut(): void;
    login(email: string, password: string): void;
  }
}
