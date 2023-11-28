import { render } from "@testing-library/react";

import PreviousLoans from "./previous-loans";

describe("PreviousLoans", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PreviousLoans />);
    expect(baseElement).toBeTruthy();
  });
});
