import { render } from "@testing-library/react";

import AssetOwnerTag from "./asset-owner-tag";

describe("AssetOwnerTag", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetOwnerTag />);
    expect(baseElement).toBeTruthy();
  });
});
