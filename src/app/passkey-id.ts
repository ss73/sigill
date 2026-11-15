/**
 * What an inbox passkey stores as its WebAuthn user ID: the owner's e-mail,
 * so unlocking on another device brings the address back. WebAuthn allows
 * at most 64 bytes.
 */

import { toBase64Url, utf8Decode, utf8Encode, type Bytes } from "../crypto";
import { cleanEmail } from "./links";

const PREFIX = "sigill:";

/**
 * "sigill:<e-mail>#<random>". The random part matters: a password manager
 * replaces an existing passkey that has the same site and user ID, so an
 * ID made from the e-mail alone would let a second "create" with the same
 * address silently destroy the first inbox's key.
 */
export function userIdFor(email: string): Bytes | undefined {
  const id = utf8Encode(`${PREFIX}${email}#${toBase64Url(crypto.getRandomValues(new Uint8Array(6)))}`);
  return id.length <= 64 ? id : undefined;
}

/** The e-mail in a user ID; also reads IDs from before the random part. */
export function emailFromUserId(id: Bytes | null): string | undefined {
  if (!id) {
    return undefined;
  }
  try {
    const text = utf8Decode(id);
    if (!text.startsWith(PREFIX)) {
      return undefined;
    }
    const rest = text.slice(PREFIX.length);
    const hash = rest.lastIndexOf("#");
    return cleanEmail(hash > rest.lastIndexOf("@") ? rest.slice(0, hash) : rest);
  } catch {
    return undefined; // a random ID from an older passkey
  }
}
