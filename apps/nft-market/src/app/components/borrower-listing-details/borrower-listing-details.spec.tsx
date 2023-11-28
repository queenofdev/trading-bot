import { render } from "@testing-library/react";

import BorrowerListingDetails from "./borrower-listing-details";

describe("BorrowerListingDetails", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerListingDetails />);
    expect(baseElement).toBeTruthy();
  });
});
