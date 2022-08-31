import { render, waitFor, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { MockedProvider } from "@apollo/client/testing";
import React from "react";
import { ME_QUERY } from "../../hooks/useMe";
import Header from "../header";

describe("<Header />", () => {
  it("renders verify banner", async () => {
    const mocks = [
      {
        request: {
          query: ME_QUERY,
        },
        result: {
          data: {
            me: {
              id: 1,
              email: "test@gmail.com",
              role: "",
              verified: false,
            },
          },
        },
      },
    ];
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );

    await screen.findByText("Please verify your email");
  });

  it("renders without verify banner", async () => {
    const mocks = [
      {
        request: {
          query: ME_QUERY,
        },
        result: {
          data: {
            me: {
              id: 1,
              email: "test@gmail.com",
              role: "",
              verified: true,
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks}>
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.queryByText("Please verify your email")).toBeNull();
    });
  });
});
