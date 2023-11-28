import { render } from "@testing-library/react";

import BorrowerAssetFilter from "./borrower-asset-filter";

describe("BorrowerAssetFilter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerAssetFilter />);
    expect(baseElement).toBeTruthy();
  });
});
