import { render } from "@testing-library/react";

import AssetDetails from "./asset-details";

describe("AssetDetails", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetDetails />);
    expect(baseElement).toBeTruthy();
  });
});
