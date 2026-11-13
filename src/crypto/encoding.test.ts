import { describe, expect, it } from "vitest";
import { concat, fromBase64Url, fromHex, toBase64Url, toHex, utf8Decode, utf8Encode } from "./encoding";

describe("base64url", () => {
  it("matches RFC 4648 test vectors without padding", () => {
    const vectors: [string, string][] = [
      ["", ""],
      ["f", "Zg"],
      ["fo", "Zm8"],
      ["foo", "Zm9v"],
      ["foob", "Zm9vYg"],
      ["fooba", "Zm9vYmE"],
      ["foobar", "Zm9vYmFy"],
    ];
    for (const [plain, encoded] of vectors) {
      expect(toBase64Url(utf8Encode(plain))).toBe(encoded);
      expect(utf8Decode(fromBase64Url(encoded))).toBe(plain);
    }
  });

  it("uses the URL-safe alphabet", () => {
    expect(toBase64Url(Uint8Array.of(0xfb, 0xff, 0xbf))).toBe("-_-_");
  });

  it("round-trips every byte value and large inputs", () => {
    const all = Uint8Array.from({ length: 256 }, (_, i) => i);
    expect(fromBase64Url(toBase64Url(all))).toEqual(all);
    const large = Uint8Array.from({ length: 100_000 }, (_, i) => (i * 31) & 0xff);
    expect(fromBase64Url(toBase64Url(large))).toEqual(large);
  });

  it("rejects invalid input", () => {
    expect(() => fromBase64Url("ab+c")).toThrow();
    expect(() => fromBase64Url("abc=")).toThrow();
    expect(() => fromBase64Url("abcde")).toThrow();
  });
});

describe("hex", () => {
  it("round-trips and rejects invalid input", () => {
    expect(toHex(fromHex("00ff10ab"))).toBe("00ff10ab");
    expect(() => fromHex("abc")).toThrow();
    expect(() => fromHex("zz")).toThrow();
  });
});

describe("utf8", () => {
  it("handles non-ASCII text", () => {
    const text = "Hej Åsa! 🔐 ñ 中文";
    expect(utf8Decode(utf8Encode(text))).toBe(text);
  });

  it("rejects malformed UTF-8", () => {
    expect(() => utf8Decode(Uint8Array.of(0xc3))).toThrow();
  });
});

describe("concat", () => {
  it("joins arrays in order", () => {
    expect(concat(Uint8Array.of(1), new Uint8Array(0), Uint8Array.of(2, 3))).toEqual(Uint8Array.of(1, 2, 3));
  });
});
