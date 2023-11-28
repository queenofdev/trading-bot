import { render } from "@testing-library/react";

import LenderAssetFilter from "./lender-asset-filter";

describe("LenderAssetFilter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LenderAssetFilter />);
    expect(baseElement).toBeTruthy();
  });
});
