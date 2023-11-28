import { render } from "@testing-library/react";

import MyAccountDetails from "./my-account-details";

describe("MyAccountDetails", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MyAccountDetails />);
    expect(baseElement).toBeTruthy();
  });
});
