import { render } from "@testing-library/react";

import OwnerInfo from "./owner-info";

describe("OwnerInfo", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<OwnerInfo />);
    expect(baseElement).toBeTruthy();
  });
});
