import { render } from "@testing-library/react";

import BalancePassPage from "./balance-pass-page";

describe("PassPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BalancePassPage />);
    expect(baseElement).toBeTruthy();
  });
});
