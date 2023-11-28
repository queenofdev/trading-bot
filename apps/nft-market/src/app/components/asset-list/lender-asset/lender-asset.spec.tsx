import { render } from "@testing-library/react";

import LenderAsset from "./lender-asset";

describe("LenderAsset", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LenderAsset />);
    expect(baseElement).toBeTruthy();
  });
});
