import { render } from "@testing-library/react";

import MyAccountOffers from "./my-account-offers";

describe("MyAccountOffers", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MyAccountOffers />);
    expect(baseElement).toBeTruthy();
  });
});
