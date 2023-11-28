import { render } from "@testing-library/react";

import LendPage from "./lend-page";

describe("LendPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<LendPage />);
    expect(baseElement).toBeTruthy();
  });
});
