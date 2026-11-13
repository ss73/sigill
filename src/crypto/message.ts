/**
 * Message envelope: one-way encryption to an inbox public key.
 *
 * Each message uses a fresh ephemeral X25519 key, so only the recipient's
 * key is long-lived and the sender needs no keys at all.
 *
 * Envelope v1 layout (base64url-encoded for transport):
 *
 *   version (1) | ephemeral public key (32) | iv (12) | AES-GCM ciphertext + tag
 *
 * AES key = HKDF-SHA256(
 *   ikm  = X25519(ephemeral, recipient),
 *   salt = ephemeral public key | recipient public key,
 *   info = "sendmesafe v1 message")
 *
 * The version byte and ephemeral key are authenticated as AES-GCM additional
 * data, and the recipient key is bound through the HKDF salt.
 */

import { concat, fromBase64Url, toBase64Url, utf8Decode, utf8Encode, type Bytes } from "./encoding";
import { KEY_LENGTH, generateEphemeralKeyPair, sharedSecret } from "./keys";

export const VERSION = 1;

const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const HEADER_LENGTH = 1 + KEY_LENGTH;
const MIN_LENGTH = HEADER_LENGTH + IV_LENGTH + TAG_LENGTH;
const MESSAGE_INFO = utf8Encode("sendmesafe v1 message");

async function messageKey(secret: Bytes, ephemeralPublic: Uint8Array, recipientPublic: Uint8Array): Promise<CryptoKey> {
  const ikm = await crypto.subtle.importKey("raw", secret, "HKDF", false, ["deriveKey"]);
  secret.fill(0);
  return crypto.subtle.deriveKey(
    { name: "HKDF", hash: "SHA-256", salt: concat(ephemeralPublic, recipientPublic), info: MESSAGE_INFO },
    ikm,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Encrypts plaintext so that only the holder of the recipient's inbox key can read it. */
export async function seal(recipientPublic: Uint8Array, plaintext: Uint8Array): Promise<Bytes> {
  const ephemeral = await generateEphemeralKeyPair();
  const secret = await sharedSecret(ephemeral.privateKey, recipientPublic);
  const key = await messageKey(secret, ephemeral.publicKey, recipientPublic);
  const header = concat(Uint8Array.of(VERSION), ephemeral.publicKey);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: header },
    key,
    new Uint8Array(plaintext),
  );
  return concat(header, iv, new Uint8Array(ciphertext));
}

/**
 * Decrypts an envelope with the recipient's inbox key pair. Throws if the
 * envelope is malformed, was sealed for another key, or has been altered.
 */
export async function open(
  recipient: { privateKey: CryptoKey; publicKey: Uint8Array },
  envelope: Uint8Array,
): Promise<Bytes> {
  if (envelope.length < MIN_LENGTH) {
    throw new Error("Message is truncated");
  }
  if (envelope[0] !== VERSION) {
    throw new Error(`Unsupported message version ${envelope[0]}`);
  }
  const header = envelope.slice(0, HEADER_LENGTH);
  const ephemeralPublic = header.subarray(1);
  const iv = envelope.slice(HEADER_LENGTH, HEADER_LENGTH + IV_LENGTH);
  const ciphertext = envelope.slice(HEADER_LENGTH + IV_LENGTH);

  const secret = await sharedSecret(recipient.privateKey, ephemeralPublic);
  const key = await messageKey(secret, ephemeralPublic, recipient.publicKey);
  try {
    const plaintext = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv, additionalData: header },
      key,
      ciphertext,
    );
    return new Uint8Array(plaintext);
  } catch {
    throw new Error("Message could not be decrypted: wrong key or altered content");
  }
}

/** Convenience wrapper: UTF-8 text in, base64url envelope out. */
export async function sealText(recipientPublic: Uint8Array, text: string): Promise<string> {
  return toBase64Url(await seal(recipientPublic, utf8Encode(text)));
}

/** Convenience wrapper: base64url envelope in, UTF-8 text out. */
export async function openText(
  recipient: { privateKey: CryptoKey; publicKey: Uint8Array },
  envelope: string,
): Promise<string> {
  return utf8Decode(await open(recipient, fromBase64Url(envelope)));
}
