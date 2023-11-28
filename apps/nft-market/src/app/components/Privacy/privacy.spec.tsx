import { render } from "@testing-library/react";

import PrivacyPage from "./privacy";

describe("PrivacyPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PrivacyPage />);
    expect(baseElement).toBeTruthy();
  });
});
