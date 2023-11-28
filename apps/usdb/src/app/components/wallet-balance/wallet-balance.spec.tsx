import { render } from "@testing-library/react";

import WalletBalance from "./wallet-balance";

describe("WalletBalance", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<WalletBalance />);
    expect(baseElement).toBeTruthy();
  });
});
