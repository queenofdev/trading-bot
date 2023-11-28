import { Asset } from "@fantohm/shared-web3";
import { render } from "@testing-library/react";

import BorrowerAsset from "./borrower-asset";

describe("BorrowerAsset", () => {
  it("should render successfully", () => {
    const { baseElement } = render(<BorrowerAsset asset={{} as Asset} />);
    expect(baseElement).toBeTruthy();
  });
});
