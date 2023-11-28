import { render } from "@testing-library/react";

import NotificationMessage from "./notification-message";

describe("NotificationMessage", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<NotificationMessage />);
    expect(baseElement).toBeTruthy();
  });
});
