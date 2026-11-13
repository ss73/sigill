/** Writing to an inbox: the page a secure link opens. No passkey needed. */

import { fingerprint } from "../../crypto";
import { h } from "../dom";
import { appBase, messageLink } from "../links";
import { asText, fitsMailto, mailto, messageEmail, type Email } from "../mail";
import { sealMessage } from "../payload";
import { actions, backLink, copyButton, field, linkButton, messageSlot, notice, page, securityCode, title } from "../ui";

export function composeView(to: Uint8Array, recipientEmail?: string): HTMLElement {
  const who = recipientEmail ?? "the owner of this link";
  const textarea = h("textarea", {
    rows: 8,
    placeholder: "Write your message…",
    "data-testid": "message",
  });
  const send = linkButton("Send by e-mail", "#", { icon: "mail", testId: "send-email" });
  send.setAttribute("aria-disabled", "true");
  const status = h("p", { class: "help", "data-testid": "compose-status" }, "Your message is encrypted as you type.");
  const slot = messageSlot();
  const codeSlot = h("div");

  let email: Email | null = null;
  let fits = true;
  let sequence = 0;

  async function update(): Promise<void> {
    const mine = ++sequence;
    const text = textarea.value;
    if (!text.trim()) {
      email = null;
      send.href = "#";
      send.setAttribute("aria-disabled", "true");
      status.textContent = "Your message is encrypted as you type.";
      return;
    }
    const envelope = await sealMessage(to, { text });
    if (mine !== sequence) {
      return; // a newer keystroke won
    }
    email = messageEmail(messageLink(appBase(), envelope));
    const full = mailto(recipientEmail, email);
    fits = fitsMailto(full);
    send.href = fits ? full : mailto(recipientEmail, { subject: email.subject });
    send.removeAttribute("aria-disabled");
    status.textContent = fits
      ? `Encrypted. Only ${who} can read it.`
      : `Encrypted. Only ${who} can read it. It's long, so it will be copied for you to paste into the e-mail.`;
  }
  textarea.addEventListener("input", () => void update());

  send.addEventListener("click", (event) => {
    if (!email) {
      event.preventDefault();
      textarea.focus();
      return;
    }
    // Copy as well: covers webmail users whose browser has no mail program set up.
    void navigator.clipboard?.writeText(fits ? asText(email) : email.body).catch(() => {});
    slot.show(
      fits
        ? notice(
            "success",
            "Your e-mail program should open with the message ready. Just press Send. ",
            "Nothing opened? The message has been copied: paste it into a new e-mail",
            recipientEmail ? ` to ${recipientEmail}.` : ".",
          )
        : notice(
            "info",
            "Your message was copied. Paste it into the e-mail that opens (⌘V or Ctrl+V) and press Send.",
          ),
    );
  });

  void fingerprint(to).then((code) =>
    codeSlot.replaceChildren(
      securityCode(
        code,
        `For extra certainty, ask ${who} by phone or in person whether their inbox shows the same code. ` +
          "If it matches, nobody has swapped the link on the way.",
      ),
    ),
  );

  return page(
    backLink(),
    title(`Secure message to ${who}`, "Write your message below. It is encrypted on this device before it leaves it."),
    h(
      "section",
      { class: "card" },
      field("Message", textarea),
      status,
      actions(send, copyButton("Copy instead", () => (email ? asText(email) : ""), { testId: "copy-message" })),
      slot.el,
      codeSlot,
    ),
  );
}

export function brokenLinkView(): HTMLElement {
  return page(
    backLink(),
    title("This secure link is incomplete"),
    notice(
      "error",
      "Part of the link seems to be missing. E-mail programs sometimes break long links. ",
      "Ask the person to send their secure link again, or copy the whole link and paste it on the ",
      h("a", { href: "#send" }, "Send page"),
      ".",
    ),
  );
}
