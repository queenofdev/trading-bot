import { render } from "@testing-library/react";

import Faq from "./faq";

describe("Faq", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Faq />);
    expect(baseElement).toBeTruthy();
  });
});
