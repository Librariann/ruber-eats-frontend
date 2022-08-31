import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import {
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import Login from "../login";
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

describe("<Login />", () => {
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(async () => {
      const mockedClient = createMockClient();
      renderResult = render(
        <Router>
          <ApolloProvider client={mockedClient}>
            <Login />
          </ApolloProvider>
        </Router>
      );
    });
  });
  it("should render OK", async () => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Ruber Eats");
    });
  });

  it("displays email validation erros", async () => {
    const email = screen.getByPlaceholderText(/Email/i);

    userEvent.type(email, "this@wont");

    await waitFor(() => {
      let errorMessage = screen.getByRole("alert");
      expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
    });

    userEvent.clear(email);

    await waitFor(() => {
      let errorMessage = screen.getByRole("alert");
      expect(errorMessage).not.toHaveTextContent(/please enter a valid email/i);
    });
  });
});
