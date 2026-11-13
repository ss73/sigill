import { describe, expect, it } from "vitest";
import { fromHex, toHex } from "./encoding";
import { fingerprint, generateEphemeralKeyPair, keyPairFromSeed, seedFromPrf, sharedSecret } from "./keys";

// RFC 7748 §6.1
const ALICE_PRIVATE = "77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a";
const ALICE_PUBLIC = "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a";
const BOB_PRIVATE = "5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb";
const BOB_PUBLIC = "de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f";
const SHARED = "4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742";

describe("keyPairFromSeed", () => {
  it("matches the RFC 7748 test vectors", async () => {
    const alice = await keyPairFromSeed(fromHex(ALICE_PRIVATE));
    const bob = await keyPairFromSeed(fromHex(BOB_PRIVATE));
    expect(toHex(alice.publicKey)).toBe(ALICE_PUBLIC);
    expect(toHex(bob.publicKey)).toBe(BOB_PUBLIC);
    expect(toHex(await sharedSecret(alice.privateKey, bob.publicKey))).toBe(SHARED);
    expect(toHex(await sharedSecret(bob.privateKey, alice.publicKey))).toBe(SHARED);
  });

  it("produces a non-extractable private key", async () => {
    const { privateKey } = await keyPairFromSeed(fromHex(ALICE_PRIVATE));
    expect(privateKey.extractable).toBe(false);
    await expect(crypto.subtle.exportKey("pkcs8", privateKey)).rejects.toThrow();
  });

  it("does not modify the caller's seed", async () => {
    const seed = fromHex(ALICE_PRIVATE);
    await keyPairFromSeed(seed);
    expect(toHex(seed)).toBe(ALICE_PRIVATE);
  });

  it("rejects seeds of the wrong length", async () => {
    await expect(keyPairFromSeed(new Uint8Array(31))).rejects.toThrow();
  });
});

describe("seedFromPrf", () => {
  it("is deterministic and depends on its input", async () => {
    const a = crypto.getRandomValues(new Uint8Array(32));
    const b = crypto.getRandomValues(new Uint8Array(32));
    expect(await seedFromPrf(a)).toEqual(await seedFromPrf(a));
    expect(await seedFromPrf(a)).not.toEqual(await seedFromPrf(b));
    expect(await seedFromPrf(a)).not.toEqual(a);
    expect((await seedFromPrf(a)).length).toBe(32);
  });

  it("rejects short input", async () => {
    await expect(seedFromPrf(new Uint8Array(16))).rejects.toThrow();
  });
});

describe("sharedSecret", () => {
  it("rejects low-order public keys", async () => {
    const { privateKey } = await generateEphemeralKeyPair();
    await expect(sharedSecret(privateKey, new Uint8Array(32))).rejects.toThrow();
  });

  it("rejects public keys of the wrong length", async () => {
    const { privateKey } = await generateEphemeralKeyPair();
    await expect(sharedSecret(privateKey, new Uint8Array(33))).rejects.toThrow();
  });
});

describe("fingerprint", () => {
  it("is a stable, formatted digest of the public key", async () => {
    const fp = await fingerprint(fromHex(ALICE_PUBLIC));
    expect(fp).toMatch(/^[0-9a-f]{4}(-[0-9a-f]{4}){3}$/);
    expect(await fingerprint(fromHex(ALICE_PUBLIC))).toBe(fp);
    expect(await fingerprint(fromHex(BOB_PUBLIC))).not.toBe(fp);
  });
});
