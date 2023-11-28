import { render } from "@testing-library/react";

import Tradfi from "./trad-fi";

describe("Tradfi", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Tradfi />);
    expect(baseElement).toBeTruthy();
  });
});
