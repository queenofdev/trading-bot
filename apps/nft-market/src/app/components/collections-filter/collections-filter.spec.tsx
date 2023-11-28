import { render } from "@testing-library/react";

import CollectionsFilter from "./collections-filter";

describe("CollectionsFilter", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<CollectionsFilter />);
    expect(baseElement).toBeTruthy();
  });
});
