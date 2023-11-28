import { render } from "@testing-library/react";

import DaiCard from "./dai-card";

describe("DaiCard", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<DaiCard />);
    expect(baseElement).toBeTruthy();
  });
});
