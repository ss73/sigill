/**
 * Light or dark look. "auto" follows the device; a choice is remembered in
 * this browser, like the language. The CSS reads the data-theme attribute.
 */

export const THEMES = ["auto", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "sigill.theme";

function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme);
}

export function theme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isTheme(stored) ? stored : "auto";
  } catch {
    return "auto";
  }
}

function apply(value: Theme): void {
  if (value === "auto") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = value;
  }
}

export function setTheme(value: Theme): void {
  apply(value);
  try {
    if (value === "auto") {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, value);
    }
  } catch {
    // Private mode: applies to this visit only.
  }
}

/** Applies the remembered choice; call before the first render. */
export function initTheme(): void {
  apply(theme());
}
