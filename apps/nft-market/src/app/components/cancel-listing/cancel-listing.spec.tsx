import { render } from "@testing-library/react";

import CancelListing from "./cancel-listing";

describe("CancelListing", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<CancelListing />);
    expect(baseElement).toBeTruthy();
  });
});
