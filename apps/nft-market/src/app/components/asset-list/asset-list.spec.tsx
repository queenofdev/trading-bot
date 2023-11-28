import { render } from "@testing-library/react";

import AssetList from "./asset-list";

describe("AssetList", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetList />);
    expect(baseElement).toBeTruthy();
  });
});
