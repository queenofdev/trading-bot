import { render } from "@testing-library/react";

import MakeOffer from "./make-offer";

describe("MakeOffer", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MakeOffer />);
    expect(baseElement).toBeTruthy();
  });
});
