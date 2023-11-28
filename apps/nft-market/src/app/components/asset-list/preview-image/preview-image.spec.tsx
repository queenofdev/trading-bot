import { render } from "@testing-library/react";

import PreviewImage from "./preview-image";

describe("PreviewImage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<PreviewImage />);
    expect(baseElement).toBeTruthy();
  });
});
