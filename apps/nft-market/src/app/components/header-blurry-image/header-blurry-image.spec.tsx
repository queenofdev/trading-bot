import { render } from "@testing-library/react";

import HeaderBlurryImage from "./header-blurry-image";

describe("HeaderBlurryImage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<HeaderBlurryImage />);
    expect(baseElement).toBeTruthy();
  });
});
