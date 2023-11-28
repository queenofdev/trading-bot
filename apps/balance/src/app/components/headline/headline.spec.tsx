import { render } from "@testing-library/react";

import Headline from "./headline";

describe("Headline", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Headline />);
    expect(baseElement).toBeTruthy();
  });
});
