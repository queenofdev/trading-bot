import { render } from "@testing-library/react";

import MyAccountAssets from "./my-account-assets";

describe("MyAccountAssets", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MyAccountAssets />);
    expect(baseElement).toBeTruthy();
  });
});
