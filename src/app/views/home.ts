import { h, icon } from "../dom";
import { page } from "../ui";

function choice(href: string, iconName: "send" | "inbox", heading: string, text: string, testId: string): HTMLElement {
  return h(
    "a",
    { class: "choice", href, "data-testid": testId },
    h("span", { class: "choice-icon" }, icon(iconName)),
    h("span", { class: "choice-text" }, h("strong", null, heading), h("span", null, text)),
  );
}

export function homeView(): HTMLElement {
  return page(
    h(
      "header",
      { class: "hero" },
      h("span", { class: "logo" }, icon("lock")),
      h("h1", { tabIndex: -1 }, "Send Me Safe"),
      h("p", { class: "lead" }, "Private messages over ordinary e-mail. Only the person you write to can read them."),
    ),
    h(
      "nav",
      { class: "choices", "aria-label": "What do you want to do?" },
      choice("#send", "send", "Send a secure message", "Write to someone confidentially", "choose-send"),
      choice("#inbox", "inbox", "Receive secure messages", "Get your own secure link in 30 seconds", "choose-receive"),
    ),
    h(
      "section",
      { class: "how", "aria-labelledby": "how-title" },
      h("h2", { id: "how-title" }, "How it works"),
      h(
        "ol",
        { class: "steps" },
        h("li", null, h("strong", null, "The recipient creates an inbox"), " with a passkey: Face ID, fingerprint or device PIN. No account, no password."),
        h("li", null, h("strong", null, "They share their secure link"), " with anyone who should be able to write to them."),
        h("li", null, h("strong", null, "Messages travel as links in normal e-mails."), " They are encrypted in your browser and only the recipient's passkey can open them."),
      ),
    ),
    h(
      "p",
      { class: "fineprint" },
      "Nothing is stored on any server. ",
      h("a", { href: "#open" }, "Have a message link that won't open?"),
    ),
  );
}
