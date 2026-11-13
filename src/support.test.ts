import { describe, expect, it } from "vitest";
import { checkSupport } from "./support";

describe("checkSupport", () => {
  it("reports nothing missing in Node's WebCrypto", async () => {
    expect(await checkSupport()).toEqual([]);
  });
});
