import { render } from "@testing-library/react";

import AssetDetailsPage from "./asset-details-page";

describe("AssetDetailsPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<AssetDetailsPage />);
    expect(baseElement).toBeTruthy();
  });
});
