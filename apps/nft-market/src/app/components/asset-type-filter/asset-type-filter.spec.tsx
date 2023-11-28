import { render } from "@testing-library/react";

import AssetTypeFilter from "./asset-type-filter";

describe("AssetTypeFilter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetTypeFilter />);
    expect(baseElement).toBeTruthy();
  });
});
