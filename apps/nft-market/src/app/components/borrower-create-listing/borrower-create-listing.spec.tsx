import { render } from "@testing-library/react";

import BorrowerCreateListing from "./borrower-create-listing";

describe("BorrowerCreateListing", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerCreateListing />);
    expect(baseElement).toBeTruthy();
  });
});
