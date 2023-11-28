import { render } from "@testing-library/react";

import ListAsCollateral from "./list-as-collateral";

describe("ListAsCollateral", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<ListAsCollateral />);
    expect(baseElement).toBeTruthy();
  });
});
