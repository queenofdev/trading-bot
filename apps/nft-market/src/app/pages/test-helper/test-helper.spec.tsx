import { render } from "@testing-library/react";

import TestHelper from "./test-helper";

describe("TestHelper", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<TestHelper />);
    expect(baseElement).toBeTruthy();
  });
});
