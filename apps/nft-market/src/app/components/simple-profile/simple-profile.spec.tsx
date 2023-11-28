import { render } from "@testing-library/react";

import SimpleProfile from "./simple-profile";

describe("SimpleProfile", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<SimpleProfile />);
    expect(baseElement).toBeTruthy();
  });
});
