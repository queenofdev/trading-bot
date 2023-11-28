import { render } from "@testing-library/react";

import TeammateProfile from "./teammate-profile";

describe("TeammateProfile", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<TeammateProfile />);
    expect(baseElement).toBeTruthy();
  });
});
