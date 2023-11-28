import { render } from "@testing-library/react";

import TermsForm from "./terms-form";

describe("InputItem", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<TermsForm />);
    expect(baseElement).toBeTruthy();
  });
});
