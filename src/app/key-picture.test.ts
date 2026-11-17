import { describe, expect, it } from "vitest";
import { keyPattern } from "./key-picture";

describe("keyPattern", () => {
  it("is the same for the same code, mirrored, in one of eight colours", () => {
    const a = keyPattern("1056-8b24-6f28-fd4f");
    expect(keyPattern("1056-8b24-6f28-fd4f")).toEqual(a);
    expect(a.cells).toHaveLength(5);
    for (const row of a.cells) {
      expect(row).toEqual([...row].reverse());
    }
    expect(a.colour).toBeGreaterThanOrEqual(0);
    expect(a.colour).toBeLessThan(8);
  });

  it("uses the code's first 15 bits for the pattern and its last byte for the colour", () => {
    expect(keyPattern("0000-0000-0000-0000").cells.flat().every((on) => !on)).toBe(true);
    expect(keyPattern("ffff-0000-0000-0000").cells.flat().every((on) => on)).toBe(true);
    expect(keyPattern("0000-0000-0000-0005").colour).toBe(5);
  });
});
