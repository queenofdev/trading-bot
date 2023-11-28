import { render } from "@testing-library/react";

import Graph from "./graph";

describe("Graph", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<Graph />);
    expect(baseElement).toBeTruthy();
  });
});
