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
import { fromBase64Url, keyPairFromSeed, seedFromPrf, toBase64Url, type Bytes, type InboxKeyPair } from "../crypto";
import { PasskeyError, createInboxPasskey, suggestInboxPasskey, unlockInboxPasskey, type PrfResult } from "../passkey";
import { t } from "./i18n";
import { cleanEmail } from "./links";
import { emailFromUserId, isInboxUserId, userIdFor } from "./passkey-id";

/** The public side of an inbox: what its secure link carries. */
export interface KnownInbox {
  publicKey: Bytes;
  email?: string;
}

const STORAGE_KEY = "sigill.inbox";

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

/** Refuses passkeys that other sites under the same domain made. */
function fromSigill(result: PrfResult): PrfResult {
  if (!isInboxUserId(result.userHandle)) {
    result.prf.fill(0);
    throw new PasskeyError("not-sigill", "This passkey was not made by Sigill.");
  }
  return result;
}

export async function unlockInbox(): Promise<InboxKeyPair> {
  const result = fromSigill(await unlockInboxPasskey(RP_ID));
  return toInbox(result, emailFromUserId(result.userHandle));
}

/**
 * Waits for the user to pick an existing inbox passkey from the e-mail
 * field's autofill. Null if the browser can't offer it, or if another
 * passkey request (create, unlock) took over.
 */
export async function suggestedInbox(): Promise<InboxKeyPair | null> {
  const result = await suggestInboxPasskey(RP_ID);
  return result ? toInbox(fromSigill(result), emailFromUserId(result.userHandle)) : null;
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
      case "not-sigill":
        return t.passkey.notSigill;
      case "failed":
        return t.passkey.failed(error.message);
    }
  }
  return error instanceof Error ? error.message : String(error);
}
