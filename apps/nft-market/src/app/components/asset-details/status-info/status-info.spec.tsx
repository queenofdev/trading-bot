import { render } from "@testing-library/react";

import StatusInfo from "./status-info";

describe("StatusInfo", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<StatusInfo />);
    expect(baseElement).toBeTruthy();
  });
});
