import { render } from "@testing-library/react";

import LoanConfirmation from "./loan-confirmation";

describe("LoanConfirmation", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LoanConfirmation />);
    expect(baseElement).toBeTruthy();
  });
});
