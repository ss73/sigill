/**
 * Byte/string conversions. Everything in the crypto module works on
 * Uint8Array; strings only appear at the edges (URLs, user text).
 */

export type Bytes = Uint8Array<ArrayBuffer>;

const BASE64URL = /^[A-Za-z0-9_-]*$/;

/** Encodes bytes as unpadded base64url (RFC 4648 §5). */
export function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  // Chunked to stay well below the argument limit of String.fromCharCode.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decodes unpadded base64url. Throws on characters outside the alphabet or impossible lengths. */
export function fromBase64Url(text: string): Bytes {
  if (!BASE64URL.test(text) || text.length % 4 === 1) {
    throw new Error("Invalid base64url string");
  }
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function fromHex(hex: string): Bytes {
  if (!/^(?:[0-9a-fA-F]{2})*$/.test(hex)) {
    throw new Error("Invalid hex string");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function utf8Encode(text: string): Bytes {
  return new TextEncoder().encode(text);
}

/** Decodes UTF-8, throwing on malformed input instead of inserting U+FFFD. */
export function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

export function concat(...parts: Uint8Array[]): Bytes {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}
