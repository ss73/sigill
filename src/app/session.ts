/**
 * The user's inbox. Two parts with different lifetimes:
 *
 * - The unlocked key pair, held in memory for this page visit only. A
 *   reload forgets it, and the passkey brings it back.
 * - The public side (inbox key and e-mail), which is what the secure link
 *   contains and is safe to share. This browser remembers it, so the link
 *   and secure reply work without a passkey prompt. Forgetting it only
 *   affects this browser.
 */

import { RP_ID } from "../config";
import { fromBase64Url, keyPairFromSeed, seedFromPrf, toBase64Url, utf8Decode, utf8Encode, type Bytes, type InboxKeyPair } from "../crypto";
import { PasskeyError, createInboxPasskey, unlockInboxPasskey, type PrfResult } from "../passkey";
import { t } from "./i18n";
import { cleanEmail } from "./links";

/** The public side of an inbox: what its secure link carries. */
export interface KnownInbox {
  publicKey: Bytes;
  email?: string;
}

const STORAGE_KEY = "sigill.inbox";

/**
 * The passkey's user ID carries the owner's e-mail, so unlocking on another
 * device brings the address back. WebAuthn allows at most 64 bytes.
 */
const USER_ID_PREFIX = "sigill:";

let current: InboxKeyPair | null = null;
let known: KnownInbox | null = load();
let readerEmail: string | undefined;

function load(): KnownInbox | null {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as { k?: unknown; e?: unknown } | null;
    if (typeof stored?.k !== "string") {
      return null;
    }
    const publicKey = fromBase64Url(stored.k);
    const email = typeof stored.e === "string" ? cleanEmail(stored.e) : undefined;
    return publicKey.length === 32 ? { publicKey, email } : null;
  } catch {
    return null;
  }
}

function remember(inbox: KnownInbox): void {
  known = inbox;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ k: toBase64Url(inbox.publicKey), e: inbox.email }));
  } catch {
    // Private mode or storage disabled: remembered for this visit only.
  }
}

function userIdFor(email: string): Bytes | undefined {
  const id = utf8Encode(USER_ID_PREFIX + email);
  return id.length <= 64 ? id : undefined;
}

function emailFromUserId(id: Bytes | null): string | undefined {
  if (!id) {
    return undefined;
  }
  try {
    const text = utf8Decode(id);
    return text.startsWith(USER_ID_PREFIX) ? cleanEmail(text.slice(USER_ID_PREFIX.length)) : undefined;
  } catch {
    return undefined; // a random ID from an older passkey
  }
}

async function toInbox(result: PrfResult, email: string | undefined): Promise<InboxKeyPair> {
  const seed = await seedFromPrf(result.prf);
  result.prf.fill(0);
  const inbox = await keyPairFromSeed(seed);
  seed.fill(0);
  current = inbox;
  const sameInbox = known && toBase64Url(known.publicKey) === toBase64Url(inbox.publicKey);
  remember({ publicKey: inbox.publicKey, email: email ?? (sameInbox ? known?.email : undefined) });
  return inbox;
}

/** The unlocked inbox, if the passkey was used during this visit. */
export function currentInbox(): InboxKeyPair | null {
  return current;
}

/** The user's own inbox as this browser knows it, unlocked or not. */
export function knownInbox(): KnownInbox | null {
  return known;
}

/** Adds the owner's e-mail to the remembered inbox (for older passkeys that lack it). */
export function setInboxEmail(value: string): void {
  const email = cleanEmail(value);
  if (known && email) {
    remember({ ...known, email });
  }
}

/** Removes the remembered inbox from this browser. The passkey is unaffected. */
export function forgetInbox(): void {
  known = null;
  current = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored.
  }
}

/**
 * The user's own e-mail: their inbox's, or the address a message they read
 * was sent to. Used to address replies.
 */
export function sessionEmail(): string | undefined {
  return known?.email ?? readerEmail;
}

export function setReaderEmail(value: string | undefined): void {
  readerEmail = value || undefined;
}

export async function createInbox(ownEmail: string): Promise<InboxKeyPair> {
  return toInbox(await createInboxPasskey(RP_ID, ownEmail, userIdFor(ownEmail)), ownEmail);
}

export async function unlockInbox(): Promise<InboxKeyPair> {
  const result = await unlockInboxPasskey(RP_ID);
  return toInbox(result, emailFromUserId(result.userHandle));
}

/** Plain-language explanation of a passkey failure. */
export function passkeyErrorMessage(error: unknown): string {
  if (error instanceof PasskeyError) {
    switch (error.code) {
      case "cancelled":
        return t.passkey.cancelled;
      case "prf-unsupported":
        return t.passkey.prfUnsupported;
      case "unavailable":
        return t.passkey.unavailable;
      case "failed":
        return t.passkey.failed(error.message);
    }
  }
  return error instanceof Error ? error.message : String(error);
}
