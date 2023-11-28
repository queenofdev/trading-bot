import { render } from "@testing-library/react";

import PriceInfo from "./price-info";

describe("PriceInfo", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PriceInfo />);
    expect(baseElement).toBeTruthy();
  });
});
