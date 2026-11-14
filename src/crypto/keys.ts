/**
 * X25519 key handling.
 *
 * An inbox key is never stored: it is recomputed from a 32-byte seed (the
 * passkey's PRF output run through HKDF) whenever a message is opened.
 * Public keys travel as 32 raw bytes; they are imported via JWK because
 * "raw" import of X25519 keys is not uniformly supported across browsers.
 */

import { concat, fromBase64Url, fromHex, toBase64Url, toHex, utf8Encode, type Bytes } from "./encoding";

export const KEY_LENGTH = 32;

const X25519 = { name: "X25519" } as const;

/** ASN.1 PKCS#8 header for an X25519 private key; the 32-byte key follows. */
const PKCS8_X25519_PREFIX = fromHex("302e020100300506032b656e04220420");

const INBOX_SEED_INFO = utf8Encode("sigill v1 inbox key");

export interface InboxKeyPair {
  /** Non-extractable; usable only for deriveBits. */
  privateKey: CryptoKey;
  publicKey: Bytes;
}

/**
 * Turns a PRF output (or any high-entropy secret) into the 32-byte seed for
 * an inbox key. Domain-separated so the PRF output is never used directly.
 */
export async function seedFromPrf(prfOutput: Uint8Array): Promise<Bytes> {
  if (prfOutput.length < 32) {
    throw new Error("PRF output too short");
  }
  const ikm = await crypto.subtle.importKey("raw", new Uint8Array(prfOutput), "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0), info: INBOX_SEED_INFO },
    ikm,
    KEY_LENGTH * 8,
  );
  return new Uint8Array(bits);
}

/** Deterministically derives an X25519 key pair from a 32-byte seed. */
export async function keyPairFromSeed(seed: Uint8Array): Promise<InboxKeyPair> {
  if (seed.length !== KEY_LENGTH) {
    throw new Error(`Seed must be ${KEY_LENGTH} bytes`);
  }
  const pkcs8 = concat(PKCS8_X25519_PREFIX, seed);
  // WebCrypto cannot compute a public key from a private one directly, so
  // import once as extractable to read the public part from its JWK...
  const extractable = await crypto.subtle.importKey("pkcs8", pkcs8, X25519, true, ["deriveBits"]);
  const jwk = await crypto.subtle.exportKey("jwk", extractable);
  if (!jwk.x) {
    throw new Error("Browser did not return the X25519 public key");
  }
  // ...then keep only a non-extractable copy for actual use.
  const privateKey = await crypto.subtle.importKey("pkcs8", pkcs8, X25519, false, ["deriveBits"]);
  pkcs8.fill(0);
  return { privateKey, publicKey: fromBase64Url(jwk.x) };
}

/** Generates a fresh single-use key pair (the sender side of a message). */
export async function generateEphemeralKeyPair(): Promise<InboxKeyPair> {
  const pair = (await crypto.subtle.generateKey(X25519, false, ["deriveBits"])) as CryptoKeyPair;
  const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  if (!jwk.x) {
    throw new Error("Browser did not return the X25519 public key");
  }
  return { privateKey: pair.privateKey, publicKey: fromBase64Url(jwk.x) };
}

export async function importPublicKey(publicKey: Uint8Array): Promise<CryptoKey> {
  if (publicKey.length !== KEY_LENGTH) {
    throw new Error(`Public key must be ${KEY_LENGTH} bytes`);
  }
  return crypto.subtle.importKey(
    "jwk",
    { kty: "OKP", crv: "X25519", x: toBase64Url(publicKey) },
    X25519,
    true,
    [],
  );
}

/**
 * Raw X25519 shared secret. Rejects the all-zero result produced by
 * low-order public keys, in case the browser does not already do so.
 */
export async function sharedSecret(privateKey: CryptoKey, publicKey: Uint8Array): Promise<Bytes> {
  const bits = await crypto.subtle.deriveBits(
    { name: "X25519", public: await importPublicKey(publicKey) },
    privateKey,
    KEY_LENGTH * 8,
  );
  const secret = new Uint8Array(bits);
  if (secret.every((b) => b === 0)) {
    throw new Error("Invalid public key");
  }
  return secret;
}

/**
 * Short human-comparable fingerprint of a public key, e.g. "3f9a-0c21-77be-d415",
 * for checking an inbox link out of band (phone, in person).
 */
export async function fingerprint(publicKey: Uint8Array): Promise<string> {
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new Uint8Array(publicKey)));
  return toHex(digest.subarray(0, 8)).match(/.{4}/g)!.join("-");
}
