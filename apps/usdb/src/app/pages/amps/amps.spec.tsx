import { render } from "@testing-library/react";

import Amps from "./amps";

describe("Amps", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Amps />);
    expect(baseElement).toBeTruthy();
  });
});
