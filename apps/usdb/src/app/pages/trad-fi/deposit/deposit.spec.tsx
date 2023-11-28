import { render } from "@testing-library/react";

import Deposit from "./deposit";

describe("Deposit", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Deposit />);
    expect(baseElement).toBeTruthy();
  });
});
