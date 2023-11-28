import { render } from "@testing-library/react";

import IconLink from "./icon-link";

describe("IconLink", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<IconLink />);
    expect(baseElement).toBeTruthy();
  });
});
