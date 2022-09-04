describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    user.login("testadmin@gmail.com", "tjdgus123");
  });
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.titleCheck("Edit Profile");
  });

  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = "testadmin@gmail.com";
      }
      console.log(req.body);
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("editadmin@gmail.com");
    user.findByRole("button").click();
  });
});
