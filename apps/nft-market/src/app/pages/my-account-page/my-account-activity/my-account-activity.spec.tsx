import { render } from "@testing-library/react";

import MyAccountActivity from "./my-account-activity";

describe("MyAccountActivity", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MyAccountActivity />);
    expect(baseElement).toBeTruthy();
  });
});
