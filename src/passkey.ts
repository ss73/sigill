/**
 * Passkey-backed inbox secrets via the WebAuthn PRF extension.
 *
 * The passkey never signs anything we check: it is used purely to compute
 * HMAC(passkey secret, PRF_SALT), a stable 32-byte value that only that
 * passkey can produce. Nothing is stored on our side; the passkey is
 * discoverable, so the user simply picks it when unlocking.
 */

import { utf8Encode, type Bytes } from "./crypto";

/** Changing this changes every user's inbox key. Bump only with a migration plan. */
const PRF_SALT = utf8Encode("sendmesafe v1 inbox prf");

export type PasskeyErrorCode = "unavailable" | "cancelled" | "prf-unsupported" | "failed";

export class PasskeyError extends Error {
  constructor(
    readonly code: PasskeyErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export interface PrfResult {
  prf: Bytes;
  credentialId: string;
  /** Diagnostics: how the result was obtained. */
  details: Record<string, string>;
}

/**
 * What the browser says about PRF before any passkey exists. This reflects
 * the browser only; the authenticator chosen later may still lack support.
 */
export async function browserPrfSupport(): Promise<"yes" | "no" | "unknown"> {
  if (!window.PublicKeyCredential) {
    return "no";
  }
  if (typeof PublicKeyCredential.getClientCapabilities !== "function") {
    return "unknown";
  }
  const caps = await PublicKeyCredential.getClientCapabilities();
  const prf = caps["extension:prf"];
  return prf === true ? "yes" : prf === false ? "no" : "unknown";
}

function randomBytes(length: number): Bytes {
  return crypto.getRandomValues(new Uint8Array(length));
}

function toBytes(source: BufferSource): Bytes {
  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source.slice(0));
  }
  return new Uint8Array(source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength) as ArrayBuffer);
}

function wrapError(error: unknown): PasskeyError {
  if (error instanceof PasskeyError) {
    return error;
  }
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return new PasskeyError("cancelled", "The passkey prompt was cancelled or timed out.");
  }
  const message = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return new PasskeyError("failed", message);
}

function requireWebAuthn(): void {
  if (!window.isSecureContext || !window.PublicKeyCredential || !navigator.credentials) {
    throw new PasskeyError("unavailable", "Passkeys need a secure (https or localhost) page in a browser that supports WebAuthn.");
  }
}

/** Asks the password manager to drop a passkey we created but cannot use. Best effort. */
async function discardCredential(rpId: string, credentialId: string): Promise<boolean> {
  if (typeof PublicKeyCredential.signalUnknownCredential !== "function") {
    return false;
  }
  try {
    await PublicKeyCredential.signalUnknownCredential({ rpId, credentialId });
    return true;
  } catch {
    return false;
  }
}

async function evaluatePrf(rpId: string, allowCredentialId?: BufferSource): Promise<PrfResult> {
  const credential = (await navigator.credentials.get({
    publicKey: {
      rpId,
      // No server verifies this assertion; the challenge only has to be fresh.
      challenge: randomBytes(32),
      userVerification: "required",
      allowCredentials: allowCredentialId ? [{ type: "public-key", id: allowCredentialId }] : [],
      extensions: { prf: { eval: { first: PRF_SALT } } },
    },
  })) as PublicKeyCredential | null;
  if (!credential) {
    throw new PasskeyError("failed", "No passkey was returned.");
  }
  const first = credential.getClientExtensionResults().prf?.results?.first;
  if (!first) {
    throw new PasskeyError("prf-unsupported", "This passkey or password manager does not support the PRF extension.");
  }
  return {
    prf: toBytes(first),
    credentialId: credential.id,
    details: {
      step: "get",
      authenticatorAttachment: credential.authenticatorAttachment ?? "unreported",
    },
  };
}

/**
 * Creates a new discoverable passkey and returns its PRF output. Some
 * platforms return the PRF result during creation; others only report that
 * PRF is enabled, which costs the user a second prompt.
 */
export async function createInboxPasskey(rpId: string, label: string): Promise<PrfResult> {
  requireWebAuthn();
  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        rp: { id: rpId, name: "Send Me Safe" },
        user: { id: randomBytes(16), name: label, displayName: label },
        challenge: randomBytes(32),
        pubKeyCredParams: [
          { type: "public-key", alg: -8 }, // Ed25519
          { type: "public-key", alg: -7 }, // ES256
          { type: "public-key", alg: -257 }, // RS256
        ],
        authenticatorSelection: { residentKey: "required", userVerification: "required" },
        extensions: { prf: { eval: { first: PRF_SALT } } },
      },
    })) as PublicKeyCredential | null;
    if (!credential) {
      throw new PasskeyError("failed", "No passkey was created.");
    }

    const prf = credential.getClientExtensionResults().prf;
    const details = {
      authenticatorAttachment: credential.authenticatorAttachment ?? "unreported",
      prfEnabledAtCreate: String(prf?.enabled),
      prfResultAtCreate: String(Boolean(prf?.results?.first)),
    };

    if (prf?.results?.first) {
      return { prf: toBytes(prf.results.first), credentialId: credential.id, details: { ...details, step: "create" } };
    }
    if (prf?.enabled === false) {
      const discarded = await discardCredential(rpId, credential.id);
      throw new PasskeyError(
        "prf-unsupported",
        "The passkey was created, but its password manager does not support PRF, so it cannot hold an inbox key." +
          (discarded ? " It has been flagged for removal." : " You may want to delete it from your password manager."),
      );
    }
    // PRF enabled (or not reported): a follow-up assertion yields the value.
    const result = await evaluatePrf(rpId, credential.rawId);
    return { ...result, details: { ...details, ...result.details, step: "create+get" } };
  } catch (error) {
    throw wrapError(error);
  }
}

/** Lets the user pick an existing inbox passkey and returns its PRF output. */
export async function unlockInboxPasskey(rpId: string): Promise<PrfResult> {
  requireWebAuthn();
  try {
    return await evaluatePrf(rpId);
  } catch (error) {
    throw wrapError(error);
  }
}

export function describeCredential(id: string): string {
  return id.length > 16 ? `${id.slice(0, 8)}…${id.slice(-8)}` : id;
}
