import { render } from "@testing-library/react";

import AssetFilter from "./asset-filter";

describe("AssetFilter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetFilter />);
    expect(baseElement).toBeTruthy();
  });
});
