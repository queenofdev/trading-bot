import { render } from "@testing-library/react";

import BalanceIconGrid from "./balance-icon-grid.tsx";

describe("BalanceIconGrid", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BalanceIconGrid />);
    expect(baseElement).toBeTruthy();
  });
});
