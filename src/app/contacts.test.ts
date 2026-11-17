import { describe, expect, it } from "vitest";
import { clearContacts, conflictFor, contactFor, contacts, forgetContact, rememberContact } from "./contacts";

const key = (n: number) => new Uint8Array(32).fill(n);

describe("contacts", () => {
  it("keeps the most recent first, without duplicates", () => {
    clearContacts();
    rememberContact({ publicKey: key(1), email: "a@example.com" });
    rememberContact({ publicKey: key(2), email: "b@example.com" });
    rememberContact({ publicKey: key(1), lang: "sv" });
    expect(contacts().map((c) => c.email)).toEqual(["a@example.com", "b@example.com"]);
    expect(contactFor(key(1))).toMatchObject({ email: "a@example.com", lang: "sv" });
  });

  it("flags another key for a known address, and an accepted one replaces it", () => {
    clearContacts();
    rememberContact({ publicKey: key(1), email: "a@example.com" });
    expect(conflictFor(key(1), "a@example.com")).toBeUndefined();
    expect(conflictFor(key(3), "other@example.com")).toBeUndefined();
    expect(conflictFor(key(3), undefined)).toBeUndefined();
    expect(conflictFor(key(3), "a@example.com")?.publicKey).toEqual(key(1));

    rememberContact({ publicKey: key(3), email: "a@example.com" });
    expect(contacts()).toHaveLength(1);
    expect(conflictFor(key(3), "a@example.com")).toBeUndefined();
    expect(conflictFor(key(1), "a@example.com")?.publicKey).toEqual(key(3));
  });

  it("forgets one", () => {
    clearContacts();
    rememberContact({ publicKey: key(1), email: "a@example.com" });
    rememberContact({ publicKey: key(2), email: "b@example.com" });
    forgetContact(key(1));
    expect(contacts().map((c) => c.email)).toEqual(["b@example.com"]);
  });
});
