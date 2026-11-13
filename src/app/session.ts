/**
 * The unlocked inbox for this page visit. Held in memory only: a reload or
 * closed tab forgets it, and the passkey brings it back.
 */

import { RP_ID } from "../config";
import { keyPairFromSeed, seedFromPrf, type InboxKeyPair } from "../crypto";
import { PasskeyError, createInboxPasskey, unlockInboxPasskey, type PrfResult } from "../passkey";

let current: InboxKeyPair | null = null;

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

export async function createInbox(email: string): Promise<InboxKeyPair> {
  return toInbox(await createInboxPasskey(RP_ID, email || "Send Me Safe inbox"));
}

export async function unlockInbox(): Promise<InboxKeyPair> {
  return toInbox(await unlockInboxPasskey(RP_ID));
}

/** Plain-language explanation of a passkey failure. */
export function passkeyErrorMessage(error: unknown): string {
  if (error instanceof PasskeyError) {
    switch (error.code) {
      case "cancelled":
        return "The passkey request was cancelled. Nothing has changed, so you can simply try again.";
      case "prf-unsupported":
        return (
          "Your browser or password manager can't hold a secure inbox yet. " +
          "Try Safari, Chrome or Edge with your device's built-in passkeys, or a recent 1Password or Bitwarden. " +
          error.message
        );
      case "unavailable":
        return "This browser doesn't support passkeys. Please use an up-to-date Safari, Chrome, Edge or Firefox.";
      case "failed":
        return `Something went wrong with the passkey: ${error.message}`;
    }
  }
  return error instanceof Error ? error.message : String(error);
}
