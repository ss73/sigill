/** Shared UI building blocks for the views. */

import { h, icon, type IconName } from "./dom";

export function page(...children: (Node | false | null | undefined)[]): HTMLElement {
  return h("div", { class: "page" }, ...children);
}

export function backLink(href = "#", label = "Back"): HTMLElement {
  return h("a", { class: "back", href }, icon("back"), label);
}

export function title(text: string, lead?: string): HTMLElement {
  return h(
    "header",
    { class: "title" },
    h("h1", { tabIndex: -1 }, text),
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
  getText: () => string,
  opts: { variant?: "primary" | "secondary"; testId?: string } = {},
): HTMLButtonElement {
  const btn = button(
    label,
    async () => {
      const text = getText();
      if (!text) {
        return;
      }
      const span = btn.querySelector("span")!;
      try {
        await navigator.clipboard.writeText(text);
        span.textContent = "Copied";
        btn.replaceChild(icon("check"), btn.firstChild!);
      } catch {
        span.textContent = "Copy failed: select and copy manually";
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
  input: HTMLInputElement | HTMLTextAreaElement,
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
    h("summary", null, "Security code ", h("code", { "data-testid": "security-code" }, code)),
    h("p", null, explanation),
  );
}
