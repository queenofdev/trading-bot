import { render } from "@testing-library/react";

import Growl from "./growl";

describe("Growl", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Growl />);
    expect(baseElement).toBeTruthy();
  });
});
