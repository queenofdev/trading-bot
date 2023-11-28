import { render } from "@testing-library/react";

import Mint from "./mint";

describe("MyAccount", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Mint />);
    expect(baseElement).toBeTruthy();
  });
});
