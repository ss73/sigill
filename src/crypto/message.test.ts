import { describe, expect, it } from "vitest";
import { fromBase64Url, toBase64Url, utf8Encode } from "./encoding";
import { keyPairFromSeed } from "./keys";
import { VERSION, open, openText, seal, sealText } from "./message";

async function newInbox() {
  return keyPairFromSeed(crypto.getRandomValues(new Uint8Array(32)));
}

describe("seal / open", () => {
  it("round-trips text, including non-ASCII and empty strings", async () => {
    const inbox = await newInbox();
    for (const text of ["Hello from the other side...", "Hej Åsa! 🔐", ""]) {
      expect(await openText(inbox, await sealText(inbox.publicKey, text))).toBe(text);
    }
  });

  it("round-trips large binary payloads", async () => {
    const inbox = await newInbox();
    const data = new Uint8Array(1_000_000);
    for (let i = 0; i < data.length; i += 65536) {
      crypto.getRandomValues(data.subarray(i, i + 65536));
    }
    expect(await open(inbox, await seal(inbox.publicKey, data))).toEqual(data);
  });

  it("produces the documented layout", async () => {
    const inbox = await newInbox();
    const envelope = await seal(inbox.publicKey, utf8Encode("abc"));
    expect(envelope[0]).toBe(VERSION);
    expect(envelope.length).toBe(1 + 32 + 12 + 3 + 16);
  });

  it("never produces the same envelope twice", async () => {
    const inbox = await newInbox();
    const a = await sealText(inbox.publicKey, "same");
    const b = await sealText(inbox.publicKey, "same");
    expect(a).not.toBe(b);
  });

  it("cannot be opened by another inbox", async () => {
    const alice = await newInbox();
    const mallory = await newInbox();
    const envelope = await sealText(alice.publicKey, "for Alice only");
    await expect(openText(mallory, envelope)).rejects.toThrow(/could not be decrypted/);
  });

  it("detects a modified byte anywhere after the version", async () => {
    const inbox = await newInbox();
    const envelope = await seal(inbox.publicKey, utf8Encode("integrity matters"));
    // Ephemeral key, IV, ciphertext and tag.
    for (const index of [1, 20, 33, 40, 45, envelope.length - 1]) {
      const tampered = envelope.slice();
      tampered[index]! ^= 0x01;
      await expect(open(inbox, tampered)).rejects.toThrow();
    }
  });

  it("rejects unknown versions and truncated envelopes", async () => {
    const inbox = await newInbox();
    const envelope = await seal(inbox.publicKey, utf8Encode("x"));
    const wrongVersion = envelope.slice();
    wrongVersion[0] = 2;
    await expect(open(inbox, wrongVersion)).rejects.toThrow(/version/);
    await expect(open(inbox, envelope.slice(0, 60))).rejects.toThrow(/truncated/);
  });

  it("survives base64url transport", async () => {
    const inbox = await newInbox();
    const envelope = await seal(inbox.publicKey, utf8Encode("over e-mail"));
    expect(await open(inbox, fromBase64Url(toBase64Url(envelope)))).toEqual(utf8Encode("over e-mail"));
  });
});
