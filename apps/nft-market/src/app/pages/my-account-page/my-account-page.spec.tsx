import { render } from "@testing-library/react";

import MyAccountPage from "./my-account-page";

describe("MyAccountPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MyAccountPage />);
    expect(baseElement).toBeTruthy();
  });
});
