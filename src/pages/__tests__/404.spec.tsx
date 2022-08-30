import { render, waitFor } from "@testing-library/react";
import React from "react";
import { NotFound } from "../404";
import { BrowserRouter as Router } from "react-router-dom";

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Ruber Eats");
    });
  });
});
