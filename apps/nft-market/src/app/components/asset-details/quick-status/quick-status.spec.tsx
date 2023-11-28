import { render } from "@testing-library/react";

import QuickStatus from "./quick-status";

describe("QuickStatus", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<QuickStatus />);
    expect(baseElement).toBeTruthy();
  });
});
