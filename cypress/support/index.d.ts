declare namespace Cypress {
  interface Chainable {
    assertLoggedIn(): void;
    assertLoggedOut(): void;
    titleCheck(title: string): void;
    login(email: string, password: string): void;
  }
}
