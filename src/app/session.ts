/**
 * The unlocked inbox for this page visit. Held in memory only: a reload or
 * closed tab forgets it, and the passkey brings it back.
 */

import { RP_ID } from "../config";
import { keyPairFromSeed, seedFromPrf, type InboxKeyPair } from "../crypto";
import { PasskeyError, createInboxPasskey, unlockInboxPasskey, type PrfResult } from "../passkey";
import { t } from "./i18n";

let current: InboxKeyPair | null = null;
let email: string | undefined;

async function toInbox(result: PrfResult): Promise<InboxKeyPair> {
  const seed = await seedFromPrf(result.prf);
  result.prf.fill(0);
  const inbox = await keyPairFromSeed(seed);
  seed.fill(0);
  current = inbox;
  return inbox;
}

export function currentInbox(): InboxKeyPair | null {
  return current;
}

/** The user's own e-mail, if they told us this visit; used to address replies. */
export function sessionEmail(): string | undefined {
  return email;
}

export function setSessionEmail(value: string | undefined): void {
  email = value || undefined;
}

export async function createInbox(ownEmail: string): Promise<InboxKeyPair> {
  const inbox = await toInbox(await createInboxPasskey(RP_ID, ownEmail || "Sigill inbox"));
  if (ownEmail) {
    setSessionEmail(ownEmail);
  }
  return inbox;
}

export async function unlockInbox(): Promise<InboxKeyPair> {
  return toInbox(await unlockInboxPasskey(RP_ID));
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
