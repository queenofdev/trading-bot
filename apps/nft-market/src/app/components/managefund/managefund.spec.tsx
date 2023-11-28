import { render } from "@testing-library/react";

import ManageFund from "./managefund";

describe("ManageFund", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ManageFund />);
    expect(baseElement).toBeTruthy();
  });
});
