/**
 * People the user has written to or heard from: their secure link (public
 * key and e-mail) and the language last used for them. Nothing here can
 * open a message, but it does show who the user corresponds with, so it can
 * be cleared or switched off per browser.
 *
 * It also guards against swapped links: once an address is known, a link
 * that claims it with another key is flagged instead of trusted.
 */

import { fromBase64Url, toBase64Url, type Bytes } from "../crypto";
import { isLang, type Lang } from "./i18n";
import { cleanEmail } from "./links";

export interface Contact {
  publicKey: Bytes;
  email?: string;
  lang?: Lang;
}

const STORAGE_KEY = "sigill.contacts";
const OFF_KEY = "sigill.contacts.off";
/** Fired on window whenever the list or the setting changes. */
export const CONTACTS_CHANGED = "sigill:contacts";

let list: Contact[] = load();

function keyId(publicKey: Bytes): string {
  return toBase64Url(publicKey);
}

function load(): Contact[] {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (!Array.isArray(stored)) {
      return [];
    }
    return stored.flatMap((item: { k?: unknown; e?: unknown; l?: unknown }) => {
      if (typeof item?.k !== "string") {
        return [];
      }
      const publicKey = fromBase64Url(item.k);
      const email = typeof item.e === "string" ? cleanEmail(item.e) : undefined;
      const lang = isLang(item.l) ? item.l : undefined;
      return publicKey.length === 32 ? [{ publicKey, email, lang }] : [];
    });
  } catch {
    return [];
  }
}

function changed(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONTACTS_CHANGED));
  }
}

function save(): void {
  changed();
  try {
    if (list.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list.map((c) => ({ k: keyId(c.publicKey), e: c.email, l: c.lang }))));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Private mode or storage disabled: remembered for this visit only.
  }
}

export function contactsEnabled(): boolean {
  try {
    return localStorage.getItem(OFF_KEY) === null;
  } catch {
    return true;
  }
}

/** Switching off also forgets everyone. */
export function setContactsEnabled(on: boolean): void {
  try {
    if (on) {
      localStorage.removeItem(OFF_KEY);
    } else {
      localStorage.setItem(OFF_KEY, "1");
    }
  } catch {
    // Applies to this visit only.
  }
  if (on) {
    changed();
  } else {
    clearContacts();
  }
}

/** Most recent first. */
export function contacts(): readonly Contact[] {
  return list;
}

export function contactFor(publicKey: Bytes): Contact | undefined {
  return list.find((c) => keyId(c.publicKey) === keyId(publicKey));
}

/**
 * A known contact with the same e-mail but another key: the link may have
 * been swapped. The new one isn't trusted until the user says so.
 */
export function conflictFor(publicKey: Bytes, email: string | undefined): Contact | undefined {
  return email ? list.find((c) => c.email === email && keyId(c.publicKey) !== keyId(publicKey)) : undefined;
}

/**
 * Adds or refreshes a contact and puts it first. It replaces one with the
 * same e-mail, so call it for a changed link only once the user accepted it.
 */
export function rememberContact(contact: Contact): void {
  if (!contactsEnabled()) {
    return;
  }
  const previous = contactFor(contact.publicKey);
  const merged: Contact = {
    publicKey: contact.publicKey,
    email: contact.email ?? previous?.email,
    lang: contact.lang ?? previous?.lang,
  };
  list = [
    merged,
    ...list.filter((c) => keyId(c.publicKey) !== keyId(merged.publicKey) && !(merged.email && c.email === merged.email)),
  ];
  save();
}

export function forgetContact(publicKey: Bytes): void {
  list = list.filter((c) => keyId(c.publicKey) !== keyId(publicKey));
  save();
}

export function clearContacts(): void {
  list = [];
  save();
}
