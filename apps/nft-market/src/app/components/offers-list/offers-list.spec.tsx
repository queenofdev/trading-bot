import { render } from "@testing-library/react";

import OffersList from "./offers-list";

describe("OffersList", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<OffersList />);
    expect(baseElement).toBeTruthy();
  });
});
