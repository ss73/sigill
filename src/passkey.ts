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
const PRF_SALT = utf8Encode("sigill v1 inbox prf");

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
  /** The user ID stored with the passkey (see createInboxPasskey). */
  userHandle: Bytes | null;
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

/**
 * A passkey autofill request that may be waiting on an e-mail field. Any
 * other passkey request cancels it first: browsers allow one at a time.
 */
let suggestion: AbortController | null = null;

function cancelSuggestion(): void {
  suggestion?.abort();
  suggestion = null;
}

function assertionOptions(allowCredentialId?: BufferSource): PublicKeyCredentialRequestOptions {
  return {
    rpId: "",
    // No server verifies this assertion; the challenge only has to be fresh.
    challenge: randomBytes(32),
    userVerification: "required",
    allowCredentials: allowCredentialId ? [{ type: "public-key", id: allowCredentialId }] : [],
    extensions: { prf: { eval: { first: PRF_SALT } } },
  };
}

function prfResult(credential: PublicKeyCredential, step: string): PrfResult | null {
  const first = credential.getClientExtensionResults().prf?.results?.first;
  if (!first) {
    return null;
  }
  const userHandle = (credential.response as AuthenticatorAssertionResponse).userHandle;
  return {
    prf: toBytes(first),
    credentialId: credential.id,
    userHandle: userHandle ? toBytes(userHandle) : null,
    details: {
      step,
      authenticatorAttachment: credential.authenticatorAttachment ?? "unreported",
    },
  };
}

async function evaluatePrf(rpId: string, allowCredentialId?: BufferSource): Promise<PrfResult> {
  cancelSuggestion();
  const credential = (await navigator.credentials.get({
    publicKey: { ...assertionOptions(allowCredentialId), rpId },
  })) as PublicKeyCredential | null;
  if (!credential) {
    throw new PasskeyError("failed", "No passkey was returned.");
  }
  const result = prfResult(credential, "get");
  if (!result) {
    throw new PasskeyError("prf-unsupported", "This passkey or password manager does not support the PRF extension.");
  }
  return result;
}

/**
 * Creates a new discoverable passkey and returns its PRF output. Some
 * platforms return the PRF result during creation; others only report that
 * PRF is enabled, which costs the user a second prompt.
 */
export async function createInboxPasskey(rpId: string, label: string, userId: Bytes = randomBytes(16)): Promise<PrfResult> {
  requireWebAuthn();
  cancelSuggestion();
  try {
    const credential = (await navigator.credentials.create({
      publicKey: {
        rp: { id: rpId, name: "Sigill" },
        user: { id: userId, name: label, displayName: label },
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
      return { prf: toBytes(prf.results.first), credentialId: credential.id, userHandle: userId, details: { ...details, step: "create" } };
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

/**
 * Offers existing inbox passkeys in the autofill of an input marked
 * autocomplete="… webauthn", without any dialog. Resolves when the user
 * picks one, or with null if unavailable or cancelled by another request.
 * It never fails on its own; only the follow-up after a pick can.
 * Where autofill doesn't return the PRF value, the chosen passkey is asked
 * once more in the usual way.
 */
export async function suggestInboxPasskey(rpId: string): Promise<PrfResult | null> {
  if (!window.isSecureContext || typeof PublicKeyCredential?.isConditionalMediationAvailable !== "function") {
    return null;
  }
  if (!(await PublicKeyCredential.isConditionalMediationAvailable())) {
    return null;
  }
  cancelSuggestion();
  const controller = new AbortController();
  suggestion = controller;
  let credential: PublicKeyCredential | null;
  try {
    credential = (await navigator.credentials.get({
      mediation: "conditional",
      signal: controller.signal,
      publicKey: { ...assertionOptions(), rpId },
    })) as PublicKeyCredential | null;
  } catch {
    // Cancelled by another request, or autofill isn't possible here (no
    // passkey support, no matching passkeys): it's only a convenience.
    return null;
  } finally {
    if (suggestion === controller) {
      suggestion = null;
    }
  }
  if (!credential) {
    return null;
  }
  try {
    return prfResult(credential, "autofill") ?? (await evaluatePrf(rpId, credential.rawId));
  } catch (error) {
    throw wrapError(error);
  }
}

export function describeCredential(id: string): string {
  return id.length > 16 ? `${id.slice(0, 8)}…${id.slice(-8)}` : id;
}
