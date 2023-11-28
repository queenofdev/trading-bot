import { render } from "@testing-library/react";

import BalanceAboutPage from "./balance-about-page";

describe("AboutPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BalanceAboutPage />);
    expect(baseElement).toBeTruthy();
  });
});
