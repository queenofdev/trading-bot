import { render } from "@testing-library/react";

import AssetCategoryFilter from "./asset-category-filter";

describe("AssetCategoryFilter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetCategoryFilter />);
    expect(baseElement).toBeTruthy();
  });
});
