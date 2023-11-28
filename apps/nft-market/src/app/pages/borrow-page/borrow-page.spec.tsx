import { render } from "@testing-library/react";

import BorrowPage from "./borrow-page";

describe("BorrowPage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowPage />);
    expect(baseElement).toBeTruthy();
  });
});
