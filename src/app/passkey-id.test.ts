import { describe, expect, it } from "vitest";
import { utf8Decode, utf8Encode } from "../crypto";
import { emailFromUserId, isInboxUserId, userIdFor } from "./passkey-id";

describe("passkey user ID", () => {
  it("is unique per passkey, so a password manager never replaces an existing inbox", () => {
    const a = userIdFor("anna@example.com")!;
    const b = userIdFor("anna@example.com")!;
    expect(utf8Decode(a)).toMatch(/^sigill:anna@example\.com#[\w-]{8}$/);
    expect(utf8Decode(a)).not.toBe(utf8Decode(b));
  });

  it("gives the e-mail back, also from passkeys made before the random part", () => {
    expect(emailFromUserId(userIdFor("anna@example.com")!)).toBe("anna@example.com");
    expect(emailFromUserId(userIdFor("a#b@example.com")!)).toBe("a#b@example.com");
    expect(emailFromUserId(utf8Encode("sigill:anna@example.com"))).toBe("anna@example.com");
    expect(emailFromUserId(utf8Encode("sigill:a#b@example.com"))).toBe("a#b@example.com");
  });

  it("falls back to no e-mail for random or overlong IDs", () => {
    expect(emailFromUserId(crypto.getRandomValues(new Uint8Array(16)))).toBeUndefined();
    expect(emailFromUserId(null)).toBeUndefined();
    const long = userIdFor(`${"a".repeat(50)}@example.com`);
    expect(long.length).toBeLessThanOrEqual(64);
    expect(emailFromUserId(long)).toBeUndefined();
    expect(isInboxUserId(long)).toBe(true);
  });

  it("tells Sigill's passkeys from other sites' on the same domain", () => {
    expect(isInboxUserId(userIdFor("anna@example.com"))).toBe(true);
    expect(isInboxUserId(new TextEncoder().encode("sigill:anna@example.com"))).toBe(true);
    expect(isInboxUserId(new TextEncoder().encode("user-42"))).toBe(false);
    expect(isInboxUserId(crypto.getRandomValues(new Uint8Array(16)))).toBe(false);
    expect(isInboxUserId(null)).toBe(false);
  });
});
