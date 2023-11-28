import { render } from "@testing-library/react";

import AssetSearch from "./borrower-asset-search";

describe("AssetSearch", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetSearch />);
    expect(baseElement).toBeTruthy();
  });
});
