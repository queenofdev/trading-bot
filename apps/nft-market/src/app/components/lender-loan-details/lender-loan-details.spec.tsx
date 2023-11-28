import { render } from "@testing-library/react";

import LenderLoanDetails from "./lender-loan-details";

describe("LenderLoanDetails", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LenderLoanDetails />);
    expect(baseElement).toBeTruthy();
  });
});
