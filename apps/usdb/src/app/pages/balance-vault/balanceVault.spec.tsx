import { render } from "@testing-library/react";

import BalanceVault from "./balanceVault";

describe("MyAccount", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BalanceVault />);
    expect(baseElement).toBeTruthy();
  });
});
