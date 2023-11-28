import { render } from "@testing-library/react";

import InputWrapper from "./input-wrapper";

describe("InputWrapper", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<InputWrapper />);
    expect(baseElement).toBeTruthy();
  });
});
