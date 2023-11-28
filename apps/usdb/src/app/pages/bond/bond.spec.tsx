import { render } from "@testing-library/react";

import Bond from "./bond";

describe("Bond", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Bond />);
    expect(baseElement).toBeTruthy();
  });
});
