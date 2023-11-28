import { render } from "@testing-library/react";

import IconGrid from "./icon-grid";

describe("IconGrid", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<IconGrid />);
    expect(baseElement).toBeTruthy();
  });
});
