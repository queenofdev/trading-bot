import { render } from "@testing-library/react";

import BorrowerLoanDetails from "./borrower-loan-details";

describe("BorrowerLoanDetails", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerLoanDetails />);
    expect(baseElement).toBeTruthy();
  });
});
