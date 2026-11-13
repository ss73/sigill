import { describe, expect, it } from "vitest";
import { fitsMailto, mailto, messageEmail } from "./mail";

describe("mailto", () => {
  it("encodes subject and body with CRLF line breaks and keeps @ readable", () => {
    const url = mailto("a+b@example.com", { subject: "Hi & bye", body: "line 1\nline 2" });
    expect(url).toBe("mailto:a%2Bb@example.com?subject=Hi%20%26%20bye&body=line%201%0D%0Aline%202");
  });

  it("works without recipient or body", () => {
    expect(mailto(undefined, { subject: "S" })).toBe("mailto:?subject=S");
    expect(mailto(undefined, {})).toBe("mailto:");
  });

  it("detects messages too long for mailto", () => {
    const short = mailto("x@y.z", messageEmail("https://e.com/#m=" + "a".repeat(100)));
    const long = mailto("x@y.z", messageEmail("https://e.com/#m=" + "a".repeat(3000)));
    expect(fitsMailto(short)).toBe(true);
    expect(fitsMailto(long)).toBe(false);
  });
});
