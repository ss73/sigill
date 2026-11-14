/**
 * UI language. Chosen in this order: the user's own pick (remembered in
 * localStorage, the only thing the app stores), the language a link was
 * written in (`l=` hint, so a Swedish e-mail opens a Swedish page), then
 * the browser's languages. English is bundled; the others load on demand.
 */

import { en, type Messages } from "./en";

export type { Messages };

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "da", name: "Dansk" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "it", name: "Italiano" },
  { code: "nl", name: "Nederlands" },
  { code: "no", name: "Norsk" },
  { code: "pl", name: "Polski" },
  { code: "pt", name: "Português" },
  { code: "fi", name: "Suomi" },
  { code: "sv", name: "Svenska" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

const loaders: Record<Exclude<Lang, "en">, () => Promise<{ messages: Messages }>> = {
  da: () => import("./da"),
  de: () => import("./de"),
  es: () => import("./es"),
  fr: () => import("./fr"),
  it: () => import("./it"),
  nl: () => import("./nl"),
  no: () => import("./no"),
  pl: () => import("./pl"),
  pt: () => import("./pt"),
  fi: () => import("./fi"),
  sv: () => import("./sv"),
};

const STORAGE_KEY = "sigill.lang";
const loaded = new Map<Lang, Messages>([["en", en]]);
let current: Lang = "en";

/** The UI texts in the current language. A live binding: always current. */
export let t: Messages = en;

export function isLang(value: unknown): value is Lang {
  return LANGUAGES.some((l) => l.code === value);
}

/** Maps browser language tags ("sv-SE", "nb", "pt-BR") to a supported language. */
export function detectLang(preferred: readonly string[]): Lang {
  for (const tag of preferred) {
    const base = tag.toLowerCase().split("-")[0];
    const code = base === "nb" || base === "nn" ? "no" : base;
    if (isLang(code)) {
      return code;
    }
  }
  return "en";
}

export function lang(): Lang {
  return current;
}

export async function messagesFor(code: Lang): Promise<Messages> {
  let messages = loaded.get(code);
  if (!messages) {
    messages = (await loaders[code as Exclude<Lang, "en">]()).messages;
    loaded.set(code, messages);
  }
  return messages;
}

export function storedLang(): Lang | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

/** Switches the UI language; `remember` keeps it for later visits. */
export async function setLang(code: Lang, remember = false): Promise<void> {
  t = await messagesFor(code);
  current = code;
  document.documentElement.lang = code;
  if (remember) {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Private mode or storage disabled: the choice lasts for this visit.
    }
  }
}

/** The language to show for a page, given the link's `l=` hint if any. */
export function preferredLang(hint: string | null): Lang {
  return storedLang() ?? (isLang(hint) ? hint : detectLang(navigator.languages));
}
