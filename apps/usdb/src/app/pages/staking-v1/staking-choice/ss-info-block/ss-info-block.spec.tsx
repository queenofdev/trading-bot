import { render } from "@testing-library/react";

import SsInfoBlock from "./ss-info-block";

describe("SsInfoBlock", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<SsInfoBlock />);
    expect(baseElement).toBeTruthy();
  });
});
