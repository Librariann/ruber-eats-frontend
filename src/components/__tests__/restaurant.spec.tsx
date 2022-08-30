import { render, screen } from "@testing-library/react";
import React from "react";
import Restaurant from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

describe("<Restaurant />", () => {
  it("renders OK with props", () => {
    const restaurantProps = {
      id: "1",
      name: "name",
      categoryName: "categoryName",
      coverImage: "x",
    };
    const {
      container: { firstChild },
    } = render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );
    screen.getByText(restaurantProps.name);
    screen.getByText(restaurantProps.categoryName);
    expect(firstChild).toHaveAttribute(
      "href",
      `/restaurants/${restaurantProps.id}`
    );
  });
});
