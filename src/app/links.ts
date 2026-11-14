/**
 * App links. All data lives in the URL fragment, which browsers never send
 * to the server:
 *
 *   #to=<inbox public key>&e=<owner e-mail>   write to an inbox
 *   #m=<envelope>&l=<lang>                    open a message
 *   #inbox&reply=<asker e-mail>&e=<e-mail>&l=<lang>   create/show your inbox
 *   #send                                     find a recipient / ask for a link
 *   #open                                     paste a message link
 *
 * `l` is the language the e-mail carrying the link was written in, so the
 * page opens in the same language (see i18n).
 */

import { fromBase64Url, toBase64Url, KEY_LENGTH, type Bytes } from "../crypto";

export type Route =
  | { name: "home" }
  | { name: "send" }
  | { name: "compose"; to: Bytes; email?: string }
  | { name: "broken-link" }
  | { name: "inbox"; reply?: string; email?: string }
  | { name: "open"; envelope?: string };

const EMAIL = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/;

export function isEmail(value: string): boolean {
  return EMAIL.test(value);
}

function email(params: URLSearchParams, key: string): string | undefined {
  const value = params.get(key)?.trim();
  return value && isEmail(value) ? value : undefined;
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
    return { name: "open", envelope: params.get("m") ?? "" };
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

/** The app's own address, e.g. "https://ss73.github.io/sigill/". */
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
  return `${base}#${fragment([["m", envelope], ["l", lang]])}`;
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
