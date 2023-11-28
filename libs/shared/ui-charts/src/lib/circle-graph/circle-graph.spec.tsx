import { render } from "@testing-library/react";

import CircleGraph from "./circle-graph";

describe("CircleGraph", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<CircleGraph />);
    expect(baseElement).toBeTruthy();
  });
});
