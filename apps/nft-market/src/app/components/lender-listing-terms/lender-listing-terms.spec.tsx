import { render } from "@testing-library/react";

import LenderListingTerms from "./lender-listing-terms";

describe("LenderListingTerms", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LenderListingTerms />);
    expect(baseElement).toBeTruthy();
  });
});
