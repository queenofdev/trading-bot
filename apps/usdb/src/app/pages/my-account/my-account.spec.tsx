import { render } from "@testing-library/react";

import MyAccount from "./my-account";

describe("MyAccount", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<MyAccount />);
    expect(baseElement).toBeTruthy();
  });
});
