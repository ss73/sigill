import { RP_ID, rpIdProblem } from "../config";
import {
  fingerprint,
  fromBase64Url,
  keyPairFromSeed,
  openText,
  sealText,
  seedFromPrf,
  toBase64Url,
  type InboxKeyPair,
} from "../crypto";
import {
  PasskeyError,
  browserPrfSupport,
  createInboxPasskey,
  describeCredential,
  unlockInboxPasskey,
  type PrfResult,
} from "../passkey";

function $<T extends HTMLElement = HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Missing element #${id}`);
  }
  return el as T;
}

const logLines: string[] = [];

function log(line: string): void {
  const time = new Date().toISOString().slice(11, 19);
  logLines.push(`[${time}] ${line}`);
  $("log").textContent = logLines.join("\n");
}

function showError(id: string, error: unknown): void {
  const el = $(id);
  el.textContent = error instanceof Error ? error.message : String(error);
  el.hidden = false;
  const code = error instanceof PasskeyError ? ` (${error.code})` : "";
  log(`ERROR${code}: ${el.textContent}`);
}

function clearError(id: string): void {
  $(id).hidden = true;
}

/** Runs an async action with its button disabled, so double clicks cannot start two prompts. */
function onClick(id: string, action: () => Promise<void>): void {
  const button = $<HTMLButtonElement>(id);
  button.addEventListener("click", async () => {
    button.disabled = true;
    try {
      await action();
    } finally {
      button.disabled = false;
    }
  });
}

// --- 1. Support -------------------------------------------------------------

async function x25519Supported(): Promise<boolean> {
  try {
    await crypto.subtle.generateKey({ name: "X25519" }, false, ["deriveBits"]);
    return true;
  } catch {
    return false;
  }
}

async function showSupport(): Promise<void> {
  const facts: [string, string, boolean | null][] = [
    ["Relying party", RP_ID, null],
    ["Secure context", String(window.isSecureContext), window.isSecureContext],
    ["WebCrypto X25519", (await x25519Supported()) ? "yes" : "no", await x25519Supported()],
    ["WebAuthn", window.PublicKeyCredential ? "yes" : "no", Boolean(window.PublicKeyCredential)],
  ];
  const prf = await browserPrfSupport();
  facts.push(["Browser reports PRF", prf, prf === "unknown" ? null : prf === "yes"]);

  const list = $("support");
  for (const [name, value, ok] of facts) {
    const dt = document.createElement("dt");
    dt.textContent = name;
    const dd = document.createElement("dd");
    dd.textContent = value;
    if (ok !== null) {
      dd.className = ok ? "yes" : "no";
    }
    list.append(dt, dd);
    log(`${name}: ${value}`);
  }
  log(`User agent: ${navigator.userAgent}`);

  const problem = rpIdProblem();
  if (problem) {
    $("rp-problem").textContent = `${problem} Passkey actions are disabled.`;
    $("rp-problem").hidden = false;
    $<HTMLButtonElement>("create").disabled = true;
    $<HTMLButtonElement>("unlock").disabled = true;
    log(`RP problem: ${problem}`);
  }
}

// --- 2. Inbox ---------------------------------------------------------------

let inbox: InboxKeyPair | null = null;

async function useInbox(result: PrfResult, action: string): Promise<void> {
  const seed = await seedFromPrf(result.prf);
  result.prf.fill(0);
  inbox = await keyPairFromSeed(seed);
  seed.fill(0);

  const publicKey = toBase64Url(inbox.publicKey);
  const fp = await fingerprint(inbox.publicKey);
  $("fingerprint").textContent = fp;
  $("public-key").textContent = publicKey;
  $("credential").textContent = describeCredential(result.credentialId);
  $("inbox").hidden = false;
  $("lock").hidden = false;
  $<HTMLInputElement>("recipient").value = publicKey;

  const details = Object.entries(result.details)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
  log(`${action} OK: fingerprint ${fp}, passkey ${describeCredential(result.credentialId)} (${details})`);
}

onClick("create", async () => {
  clearError("inbox-error");
  const label = $<HTMLInputElement>("label").value.trim() || "Sigill inbox";
  log(`Creating passkey "${label}" for ${RP_ID}…`);
  try {
    await useInbox(await createInboxPasskey(RP_ID, label), "Create");
  } catch (error) {
    showError("inbox-error", error);
  }
});

onClick("unlock", async () => {
  clearError("inbox-error");
  log(`Unlocking with a passkey for ${RP_ID}…`);
  try {
    await useInbox(await unlockInboxPasskey(RP_ID), "Unlock");
  } catch (error) {
    showError("inbox-error", error);
  }
});

onClick("lock", async () => {
  inbox = null;
  $("inbox").hidden = true;
  $("lock").hidden = true;
  $("decrypted").hidden = true;
  log("Locked: inbox key discarded from memory.");
});

// --- 3. Encrypt -------------------------------------------------------------

onClick("encrypt", async () => {
  clearError("send-error");
  try {
    const recipient = fromBase64Url($<HTMLInputElement>("recipient").value.trim());
    const envelope = await sealText(recipient, $<HTMLTextAreaElement>("plaintext").value);
    $<HTMLTextAreaElement>("envelope").value = envelope;
    $("envelope-size").textContent = `${envelope.length} characters`;
    log(`Encrypted ${$<HTMLTextAreaElement>("plaintext").value.length} chars → ${envelope.length} chars`);
  } catch (error) {
    showError("send-error", error);
  }
});

// --- 4. Decrypt -------------------------------------------------------------

onClick("decrypt", async () => {
  clearError("open-error");
  $("decrypted").hidden = true;
  try {
    if (!inbox) {
      throw new Error("Create or unlock an inbox first.");
    }
    const envelope = $<HTMLTextAreaElement>("envelope").value.trim();
    if (!envelope) {
      throw new Error("Paste an encrypted message first.");
    }
    const text = await openText(inbox, envelope);
    $("decrypted").textContent = text;
    $("decrypted").hidden = false;
    log("Decrypted OK.");
  } catch (error) {
    showError("open-error", error);
  }
});

// --- Report -----------------------------------------------------------------

onClick("copy-log", async () => {
  await navigator.clipboard.writeText(logLines.join("\n"));
  log("Report copied to clipboard.");
});

await showSupport();
