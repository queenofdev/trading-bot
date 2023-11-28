import { render } from "@testing-library/react";

import HelpPage from "./help";

describe("HelpPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<HelpPage />);
    expect(baseElement).toBeTruthy();
  });
});
