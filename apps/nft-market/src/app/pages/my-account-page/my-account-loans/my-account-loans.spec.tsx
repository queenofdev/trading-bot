import { render } from "@testing-library/react";

import MyAccountLoans from "./my-account-loans";

describe("MyAccountLoans", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MyAccountLoans />);
    expect(baseElement).toBeTruthy();
  });
});
