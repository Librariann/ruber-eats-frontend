import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import {
  findByText,
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
import { LOGIN_MUTATION } from "../login";

describe("<Login />", () => {
  let renderResult: RenderResult;
  let mockedClient: MockApolloClient;
  beforeEach(async () => {
    await waitFor(async () => {
      mockedClient = createMockClient();
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

    //email vaildation error testing
    userEvent.type(email, "this@wont");
    await screen.findByText(/please enter a valid email/i);

    //email input value clear testing
    userEvent.clear(email);
    await screen.findByText(/email is required/i);
  });

  it("display password required errors", async () => {
    const email = screen.getByPlaceholderText(/Email/i);
    const submitBtn = screen.getByTestId("button");

    userEvent.type(email, "this@wont.com");
    fireEvent.click(submitBtn);

    await screen.findByText(/password is required/i);
  });

  it("submits form and calls mutation", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const submitBtn = screen.getByTestId("button");

    const formData = {
      email: "real@test.com",
      password: "tjdgus123",
    };
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          token: "test",
          error: "mutation-error",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);

    jest.spyOn(Storage.prototype, "setItem");

    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedMutationResponse).toHaveBeenCalledWith({
        loginInput: {
          email: formData.email,
          password: formData.password,
        },
      });
    });

    /*
    implementation 이라서
    spyOn으로 localStorage를 가져와 test한다해도 커버가 안되므로
    coverage에서 봤을때 사라지지 않는것임
    그래도 테스트 해주는것이 좋음
    */
    expect(localStorage.setItem).toHaveBeenCalledWith("ruber-token", "test");

    await screen.findByText(/mutation-error/i);
  });
});
