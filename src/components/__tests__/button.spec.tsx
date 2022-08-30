import { render, screen } from "@testing-library/react";
import React from "react";
import Button from "../button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    render(<Button canClick={true} loading={false} actionText={"test"} />);
    screen.getByText("test");
  });

  it("로딩시 loading... text 출력", () => {
    const {
      container: { firstChild },
    } = render(<Button canClick={false} loading={true} actionText={"test"} />);

    screen.getByText("Loading...");
    expect(firstChild).toHaveClass("pointer-events-none");
  });
});
