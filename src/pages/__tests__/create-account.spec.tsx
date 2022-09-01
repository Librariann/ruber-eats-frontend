import { ApolloProvider } from "@apollo/client";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import React from "react";
import CreateAccount, { CREATE_ACCOUNT_MUTATION } from "../create-account";
import {
  render,
  waitFor,
  RenderResult,
  screen,
  fireEvent,
} from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../__api__/types";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  //mocking 하기위한 module을 불러온다
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule, //모든 모듈을 불러오고
    useNavigate: () => mockPush, //mocking할 모듈만 변경
  };
});

describe("<CreateAccount />", () => {
  let mockedClient: MockApolloClient;
  let renderResult: RenderResult;
  beforeEach(async () => {
    await waitFor(() => {
      mockedClient = createMockClient();
      render(
        <ApolloProvider client={mockedClient}>
          <CreateAccount />
        </ApolloProvider>
      );
    });
  });
  it("renders OK", async () => {
    await waitFor(() =>
      expect(document.title).toBe("Create Account | Ruber Eats")
    );
  });

  it("renders validation errors", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByTestId("button");

    userEvent.type(email, "wont@work");
    await screen.findByText(/please enter a valid email/i);

    userEvent.clear(email);
    await screen.findByText(/email is required/i);

    userEvent.type(email, "working@email.com");
    fireEvent.click(button);
    await screen.findByText(/password is required/i);
  });

  it("submits mutation with form values", async () => {
    const email = screen.getByPlaceholderText(/email/i);
    const password = screen.getByPlaceholderText(/password/i);
    const button = screen.getByTestId("button");
    const formData = {
      email: "working@mail.com",
      password: "1234",
      role: UserRole.Client,
    };
    const mockedLoginMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: "mutation-error",
        },
      },
    });

    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedLoginMutationResponse
    );

    jest.spyOn(window, "alert").mockImplementation(() => null);

    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedLoginMutationResponse).toHaveBeenCalledTimes(1);
      expect(mockedLoginMutationResponse).toHaveBeenCalledWith({
        createAccountInput: {
          email: formData.email,
          password: formData.password,
          role: formData.role,
        },
      });
    });
    expect(window.alert).toHaveBeenCalledWith("Account Created! Log in now!");
    const mutationError = screen.getByRole("alert");
    expect(mockPush).toHaveBeenCalledWith("/");
    expect(mutationError).toHaveTextContent("mutation-error");
  });

  //모든 작업이 끝난 후 mocking한 모듈 allClear
  afterAll(() => {
    jest.clearAllMocks();
  });
});
