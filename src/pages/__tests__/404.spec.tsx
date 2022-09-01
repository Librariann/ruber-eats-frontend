import React from "react";
import { NotFound } from "../404";
import { BrowserRouter as Router } from "react-router-dom";
import { render, waitFor } from "../../test-utils";

describe("<NotFound />", () => {
  it("renders OK", async () => {
    render(<NotFound />);
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Ruber Eats");
    });
  });
});
