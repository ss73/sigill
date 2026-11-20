/**
 * App links. All data lives in the URL fragment, which browsers never send
 * to the server:
 *
 *   #to=<inbox public key>&e=<owner e-mail>   write to an inbox
 *   #c=<check>&m=<envelope>&l=<lang>          open a message
 *   #inbox&reply=<asker e-mail>&e=<e-mail>&l=<lang>   create/show your inbox
 *   #send                                     find a recipient / ask for a link
 *   #open                                     paste a message link
 *
 * `l` is the language the e-mail carrying the link was written in, so the
 * page opens in the same language (see i18n).
 *
 * `c` is a checksum of the envelope, so a link that a mail program cut short
 * or rewrote is reported as damaged rather than as "not for your inbox". It
 * comes first because links are cut at the end. Links without it (made
 * before it existed) still open; their damage just can't be told apart.
 */

import { fromBase64Url, toBase64Url, KEY_LENGTH, type Bytes } from "../crypto";

export type Route =
  | { name: "home" }
  | { name: "send" }
  | { name: "compose"; to: Bytes; email?: string }
  | { name: "broken-link" }
  | { name: "inbox"; reply?: string; email?: string }
  | { name: "open"; envelope?: string; check?: string };

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

/** Invisible, control and direction-changing characters, and odd spaces. */
const HIDDEN = /[\p{C}\p{Z}]/u;

/** Domain labels: letters, digits and hyphens only (no "%41" escapes etc.). */
const DOMAIN = /^[\p{L}\p{M}\p{N}-]+(\.[\p{L}\p{M}\p{N}-]+)+$/u;

/**
 * Checks an address and returns it in the form to show and use, or
 * undefined. Addresses come from links and messages anyone can write, so
 * anything that could make one look like another is refused or exposed:
 * hidden characters are rejected, and a domain with non-Latin letters is
 * shown as "xn--…" (as browsers do), so "exаmple.com" with a Cyrillic "а"
 * can't pass for example.com.
 */
export function cleanEmail(value: string): string | undefined {
  const text = value.trim();
  if (!EMAIL.test(text) || HIDDEN.test(text)) {
    return undefined;
  }
  const at = text.lastIndexOf("@");
  if (!DOMAIN.test(text.slice(at + 1))) {
    return undefined;
  }
  try {
    const domain = new URL(`http://${text.slice(at + 1)}`).hostname;
    return `${text.slice(0, at)}@${domain}`;
  } catch {
    return undefined;
  }
}

function email(params: URLSearchParams, key: string): string | undefined {
  const value = params.get(key);
  return value ? cleanEmail(value) : undefined;
}

function fragment(entries: [string, string | undefined][]): string {
  return entries
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => (value === "" ? key : `${key}=${encodeURIComponent(value!)}`))
    .join("&");
}

export function parseRoute(hash: string): Route {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (params.has("m")) {
    const check = params.get("c");
    return { name: "open", envelope: params.get("m") ?? "", ...(check !== null && { check }) };
  }
  if (params.has("to")) {
    try {
      const to = fromBase64Url(params.get("to") ?? "");
      if (to.length === KEY_LENGTH) {
        return { name: "compose", to, email: email(params, "e") };
      }
    } catch {
      // fall through
    }
    return { name: "broken-link" };
  }
  if (params.has("inbox")) {
    return { name: "inbox", reply: email(params, "reply"), email: email(params, "e") };
  }
  if (params.has("send")) {
    return { name: "send" };
  }
  if (params.has("open")) {
    return { name: "open" };
  }
  return { name: "home" };
}

/** The app's own address, e.g. "https://sigill.x509.se/". */
export function appBase(): string {
  return new URL(import.meta.env.BASE_URL, location.origin).href;
}

export function inboxLink(base: string, publicKey: Uint8Array, ownerEmail?: string): string {
  return `${base}${inboxHash(publicKey, ownerEmail)}`;
}

export function inboxHash(publicKey: Uint8Array, ownerEmail?: string): string {
  return `#${fragment([["to", toBase64Url(publicKey)], ["e", ownerEmail]])}`;
}

export function messageLink(base: string, envelope: string, lang?: string): string {
  return `${base}#${fragment([["c", linkCheck(envelope)], ["m", envelope], ["l", lang]])}`;
}

/** CRC-32 of the envelope text, base64url: catches accidents, not forgery. */
export function linkCheck(envelope: string): string {
  let crc = ~0;
  for (let i = 0; i < envelope.length; i++) {
    crc ^= envelope.charCodeAt(i);
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  crc = ~crc >>> 0;
  return toBase64Url(new Uint8Array([crc >>> 24, crc >>> 16, crc >>> 8, crc]));
}

/** True or false for a link with a check; undefined for one made without. */
export function linkIntact(envelope: string, check: string | undefined): boolean | undefined {
  return check === undefined ? undefined : check === linkCheck(envelope);
}

export function inviteLink(base: string, opts: { reply?: string; email?: string; lang?: string }): string {
  return `${base}#${fragment([["inbox", ""], ["reply", opts.reply], ["e", opts.email], ["l", opts.lang]])}`;
}

/** The `l=` language hint of a link, if any. */
export function langHint(hash: string): string | null {
  return new URLSearchParams(hash.replace(/^#/, "")).get("l");
}

/**
 * Extracts the fragment from a pasted app link (or a bare fragment), or
 * returns null if the text is not one of our links.
 */
export function fragmentFromPaste(text: string): string | null {
  const trimmed = text.trim();
  const index = trimmed.indexOf("#");
  if (index < 0) {
    return null;
  }
  const hash = trimmed.slice(index);
  const route = parseRoute(hash);
  return route.name === "home" ? null : hash;
}

/** Whether a pasted text is a message link, i.e. has an envelope. */
export function isMessageFragment(hash: string): boolean {
  const route = parseRoute(hash);
  return route.name === "open" && !!route.envelope;
}
