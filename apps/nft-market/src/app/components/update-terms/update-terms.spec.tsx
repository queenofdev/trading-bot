import { render } from "@testing-library/react";

import UpdateTerms from "./update-terms";

describe("UpdateTerms", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<UpdateTerms />);
    expect(baseElement).toBeTruthy();
  });
});
