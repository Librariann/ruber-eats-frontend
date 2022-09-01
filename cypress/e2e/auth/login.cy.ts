describe("Log In", () => {
  const login = cy;
  it("should see login page", () => {
    login.visit("/").title().should("eq", "Login | Ruber Eats");
  });

  it("can see email / password validation errors", () => {
    login.visit("/");
    login.findByPlaceholderText(/email/i).type("bad@email");
    login.findByRole("alert").should("have.text", "Please enter a valid email");
    login.findByPlaceholderText(/email/i).clear();
    login.findByRole("alert").should("have.text", "Email is required");
    login.findByPlaceholderText(/email/i).type("bad@email.com");
    login
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    login.findByRole("alert").should("have.text", "Password is required");
  });

  it("can fill out the form and log in", () => {
    login.login("testadmin@gmail.com", "tjdgus123");
  });
});
