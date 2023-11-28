import { render } from "@testing-library/react";

import BalanceVaultDetailsPage from "./balance-vault-details-page";

describe("BalanceVaultDetailsPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BalanceVaultDetailsPage />);
    expect(baseElement).toBeTruthy();
  });
});
