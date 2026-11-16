/**
 * The user's inboxes: one per e-mail address they use. Two parts with
 * different lifetimes:
 *
 * - Unlocked key pairs, held in memory for this page visit only. A reload
 *   forgets them, and the passkey brings them back.
 * - The public side (inbox key and e-mail), which is what a secure link
 *   contains and is safe to share. This browser remembers it, so links and
 *   secure reply work without a passkey prompt. Forgetting it only affects
 *   this browser.
 *
 * The first remembered inbox is the one in use: the last one created,
 * unlocked or picked.
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

const STORAGE_KEY = "sigill.inboxes";
/** Before several inboxes: a single one. Read once, then replaced. */
const OLD_STORAGE_KEY = "sigill.inbox";

let unlocked: InboxKeyPair[] = [];
let known: KnownInbox[] = load();
save(); // moves an inbox stored the old way
/** The address a message was sent to, for an inbox that doesn't know its own. */
let reader: { key: string; email: string } | null = null;

function keyId(publicKey: Bytes): string {
  return toBase64Url(publicKey);
}

function parse(value: unknown): KnownInbox | null {
  const stored = value as { k?: unknown; e?: unknown } | null;
  if (typeof stored?.k !== "string") {
    return null;
  }
  const publicKey = fromBase64Url(stored.k);
  const email = typeof stored.e === "string" ? cleanEmail(stored.e) : undefined;
  return publicKey.length === 32 ? { publicKey, email } : null;
}

function load(): KnownInbox[] {
  try {
    const list: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (Array.isArray(list)) {
      return list.map(parse).filter((inbox): inbox is KnownInbox => inbox !== null);
    }
    const old = parse(JSON.parse(localStorage.getItem(OLD_STORAGE_KEY) ?? "null"));
    return old ? [old] : [];
  } catch {
    return [];
  }
}

function save(): void {
  try {
    if (known.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(known.map((inbox) => ({ k: keyId(inbox.publicKey), e: inbox.email }))));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    localStorage.removeItem(OLD_STORAGE_KEY);
  } catch {
    // Private mode or storage disabled: remembered for this visit only.
  }
}

function find(publicKey: Bytes): KnownInbox | undefined {
  return known.find((inbox) => keyId(inbox.publicKey) === keyId(publicKey));
}

/** Puts an inbox first: the one in use. */
function remember(inbox: KnownInbox): void {
  known = [inbox, ...known.filter((other) => keyId(other.publicKey) !== keyId(inbox.publicKey))];
  save();
}

async function toInbox(result: PrfResult, email: string | undefined): Promise<InboxKeyPair> {
  const seed = await seedFromPrf(result.prf);
  result.prf.fill(0);
  const inbox = await keyPairFromSeed(seed);
  seed.fill(0);
  unlocked = [inbox, ...unlocked.filter((other) => keyId(other.publicKey) !== keyId(inbox.publicKey))];
  remember({ publicKey: inbox.publicKey, email: email ?? find(inbox.publicKey)?.email });
  return inbox;
}

/** Inboxes unlocked with their passkey during this visit, last one first. */
export function unlockedInboxes(): readonly InboxKeyPair[] {
  return unlocked;
}

/** The inbox in use, as this browser knows it, unlocked or not. */
export function knownInbox(): KnownInbox | null {
  return known[0] ?? null;
}

/** All inboxes this browser knows, the one in use first. */
export function knownInboxes(): readonly KnownInbox[] {
  return known;
}

/** The known inbox for an e-mail address, if any. */
export function inboxFor(email: string): KnownInbox | undefined {
  return known.find((inbox) => inbox.email === email);
}

/** Makes a known inbox the one in use. */
export function useInbox(publicKey: Bytes): void {
  const inbox = find(publicKey);
  if (inbox) {
    remember(inbox);
  }
}

/** Adds the owner's e-mail to the inbox in use (for passkeys that lack it). */
export function setInboxEmail(value: string): void {
  const email = cleanEmail(value);
  if (known[0] && email) {
    remember({ ...known[0], email });
  }
}

/** Removes an inbox from this browser. Its passkey is unaffected. */
export function forgetInbox(publicKey: Bytes): void {
  known = known.filter((inbox) => keyId(inbox.publicKey) !== keyId(publicKey));
  unlocked = unlocked.filter((inbox) => keyId(inbox.publicKey) !== keyId(publicKey));
  save();
}

/** An inbox's e-mail: its own, or the address a message to it was sent to. */
export function emailOf(inbox: KnownInbox): string | undefined {
  return inbox.email ?? (reader?.key === keyId(inbox.publicKey) ? reader.email : undefined);
}

/** The user's e-mail as far as this visit knows it; to prefill forms. */
export function sessionEmail(): string | undefined {
  return known[0]?.email ?? reader?.email;
}

/** Remembers, for this visit, the address a message to an inbox was sent to. */
export function setReaderEmail(publicKey: Bytes, value: string): void {
  reader = { key: keyId(publicKey), email: value };
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
