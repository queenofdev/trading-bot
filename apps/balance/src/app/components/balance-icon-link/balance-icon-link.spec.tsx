import { render } from "@testing-library/react";

import BalanceIconLink from "./balance-icon-link";

describe("BalanceIconLink", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BalanceIconLink />);
    expect(baseElement).toBeTruthy();
  });
});
