/** Shared UI building blocks for the views. */

import { h, icon, type IconName } from "./dom";
import { LANGUAGES, isLang, t, type Lang } from "./i18n";

export function page(...children: (Node | false | null | undefined)[]): HTMLElement {
  return h("div", { class: "page" }, ...children);
}

export function backLink(href = "#", label = t.common.back): HTMLElement {
  return h("a", { class: "back", href }, icon("back"), label);
}

/**
 * Text with line-break opportunities after "@" and "." in e-mail addresses,
 * so a long address in a heading wraps at a sensible place rather than
 * splitting "example.co" from "m".
 */
function breakableAddresses(text: string): (string | Node)[] {
  return text.split(/(\S+@\S+)/).flatMap((part, i) =>
    i % 2 === 0 ? [part] : part.split(/(?<=[@.])/).flatMap((piece, j) => (j === 0 ? [piece] : [h("wbr"), piece])),
  );
}

export function title(text: string, lead?: string): HTMLElement {
  return h(
    "header",
    { class: "title" },
    h("h1", { tabIndex: -1 }, ...breakableAddresses(text)),
    lead ? h("p", { class: "lead" }, lead) : null,
  );
}

export function button(
  label: string,
  onClick: (event: MouseEvent) => void | Promise<void>,
  opts: { variant?: "primary" | "secondary" | "text"; icon?: IconName; testId?: string } = {},
): HTMLButtonElement {
  const btn = h(
    "button",
    { type: "button", class: `btn ${opts.variant ?? "primary"}`, "data-testid": opts.testId },
    opts.icon ? icon(opts.icon) : null,
    h("span", null, label),
  );
  btn.addEventListener("click", async (event) => {
    if (btn.getAttribute("aria-busy") === "true") {
      return;
    }
    btn.setAttribute("aria-busy", "true");
    try {
      await onClick(event);
    } finally {
      btn.removeAttribute("aria-busy");
    }
  });
  return btn;
}

/** A link styled as a button, e.g. for mailto: links that must stay real anchors. */
export function linkButton(
  label: string,
  href: string,
  opts: { variant?: "primary" | "secondary"; icon?: IconName; testId?: string } = {},
): HTMLAnchorElement {
  return h(
    "a",
    { class: `btn ${opts.variant ?? "primary"}`, href, "data-testid": opts.testId },
    opts.icon ? icon(opts.icon) : null,
    h("span", null, label),
  );
}

/** Copies text with visible confirmation; selects a fallback field if the clipboard is unavailable. */
export function copyButton(
  label: string,
  getText: () => string | { text: string; html: string },
  opts: { variant?: "primary" | "secondary"; testId?: string } = {},
): HTMLButtonElement {
  const btn = button(
    label,
    async () => {
      const content = getText();
      if (!content) {
        return;
      }
      const span = btn.querySelector("span")!;
      try {
        if (typeof content === "string") {
          await navigator.clipboard.writeText(content);
        } else {
          // Rich copy, so the paste keeps the formatting; plain text for everything else.
          await navigator.clipboard.write([
            new ClipboardItem({
              "text/html": new Blob([content.html], { type: "text/html" }),
              "text/plain": new Blob([content.text], { type: "text/plain" }),
            }),
          ]);
        }
        span.textContent = t.common.copied;
        btn.replaceChild(icon("check"), btn.firstChild!);
      } catch {
        span.textContent = t.common.copyFailed;
      }
      setTimeout(() => {
        span.textContent = label;
        btn.replaceChild(icon("copy"), btn.firstChild!);
      }, 2000);
    },
    { variant: opts.variant ?? "secondary", icon: "copy", testId: opts.testId },
  );
  return btn;
}

export function notice(kind: "info" | "success" | "error", ...children: (Node | string)[]): HTMLElement {
  const iconName: IconName = kind === "error" ? "alert" : kind === "success" ? "check" : "key";
  return h(
    "div",
    { class: `notice ${kind}`, role: kind === "error" ? "alert" : "status" },
    icon(iconName),
    h("div", null, ...children),
  );
}

/** A slot that shows at most one message at a time. */
export function messageSlot(): { el: HTMLElement; show: (node: HTMLElement | null) => void } {
  const el = h("div", { class: "slot", "aria-live": "polite" });
  return {
    el,
    show(node) {
      el.replaceChildren(...(node ? [node] : []));
    },
  };
}

export function field(
  labelText: string,
  input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  help?: string,
): HTMLElement {
  const id = input.id || `f-${Math.random().toString(36).slice(2, 8)}`;
  input.id = id;
  const helpEl = help ? h("p", { class: "help", id: `${id}-help` }, help) : null;
  if (helpEl) {
    input.setAttribute("aria-describedby", helpEl.id);
  }
  return h("div", { class: "field" }, h("label", { for: id }, labelText), input, helpEl);
}

export function actions(...children: (Node | false | null | undefined)[]): HTMLElement {
  return h("div", { class: "actions" }, ...children);
}

export function securityCode(code: string, explanation: string): HTMLElement {
  return h(
    "details",
    { class: "code" },
    h("summary", null, `${t.common.securityCode} `, h("code", { "data-testid": "security-code" }, code)),
    h("p", null, explanation),
  );
}

/** A language picker; each language is listed in its own name. */
export function languageSelect(value: Lang, onChange: (lang: Lang) => void, testId?: string): HTMLSelectElement {
  const select = h(
    "select",
    { "data-testid": testId },
    ...LANGUAGES.map((l) => h("option", { value: l.code, lang: l.code, selected: l.code === value }, l.name)),
  );
  select.addEventListener("change", () => {
    if (isLang(select.value)) {
      onChange(select.value);
    }
  });
  return select;
}
