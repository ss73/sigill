/** Writing to an inbox: the page a secure link opens. No passkey needed. */

import { fingerprint, type InboxKeyPair } from "../../crypto";
import { h } from "../dom";
import { appBase, isEmail, messageLink } from "../links";
import { asText, fitsMailto, mailto, messageEmail, type Email } from "../mail";
import { sealMessage, type ReplyTo } from "../payload";
import { createInbox, currentInbox, passkeyErrorMessage, sessionEmail, setSessionEmail, unlockInbox } from "../session";
import { PasskeyError } from "../../passkey";
import { actions, backLink, button, copyButton, field, linkButton, messageSlot, notice, page, securityCode, title } from "../ui";

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

  // --- Secure reply ------------------------------------------------------------
  // Included by default when the user already unlocked their inbox this visit
  // (e.g. they just read a message and pressed "Reply securely").
  let replyInbox: InboxKeyPair | null = currentInbox();
  const replyEmail = h("input", {
    type: "email",
    autocomplete: "email",
    placeholder: "you@email.com",
    value: sessionEmail() ?? "",
    "data-testid": "reply-email",
  });
  replyEmail.addEventListener("input", () => {
    const value = replyEmail.value.trim();
    if (isEmail(value)) {
      setSessionEmail(value);
    }
    void update();
  });
  const replyPanel = h("div", { class: "reply", "data-testid": "reply-panel" });
  const replySlot = messageSlot();

  async function attach(action: () => Promise<InboxKeyPair>): Promise<void> {
    replySlot.show(null);
    try {
      replyInbox = await action();
      replyEmail.value = replyEmail.value || sessionEmail() || "";
      renderReply();
      void update();
    } catch (error) {
      const cancelled = error instanceof PasskeyError && error.code === "cancelled";
      replySlot.show(
        cancelled
          ? notice(
              "info",
              "No secure inbox yet? Create one now: it takes one passkey confirmation, and your message stays as it is. ",
              button("Create my inbox", () => attach(() => createInbox(replyEmail.value.trim())), {
                variant: "text",
                testId: "reply-create",
              }),
            )
          : notice("error", passkeyErrorMessage(error)),
      );
    }
  }

  function renderReply(): void {
    if (replyInbox) {
      replyPanel.replaceChildren(
        notice(
          "success",
          h("strong", null, "Secure reply is on. "),
          `${recipientEmail ?? "The recipient"} can answer with one click, and the reply is encrypted for your inbox. `,
          button(
            "Remove",
            () => {
              replyInbox = null;
              renderReply();
              void update();
            },
            { variant: "text", testId: "reply-remove" },
          ),
        ),
        field("Your e-mail address", replyEmail, "Optional. So the reply is addressed to you."),
      );
    } else {
      replyPanel.replaceChildren(
        actions(
          button("Let them reply securely", () => attach(unlockInbox), {
            variant: "secondary",
            icon: "key",
            testId: "reply-add",
          }),
        ),
        h("p", { class: "help" }, "Adds your secure inbox to the message, so their answer is encrypted too. You confirm with your passkey."),
        replySlot.el,
      );
    }
  }
  renderReply();

  // --- Encrypt as you type --------------------------------------------------------
  let email: Email | null = null;
  let fits = true;
  let sequence = 0;

  function replyTo(): ReplyTo | undefined {
    if (!replyInbox) {
      return undefined;
    }
    const own = replyEmail.value.trim();
    return { key: replyInbox.publicKey, email: isEmail(own) ? own : undefined };
  }

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
    const envelope = await sealMessage(to, { text, replyTo: replyTo(), to: recipientEmail });
    if (mine !== sequence) {
      return; // a newer change won
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
      replyPanel,
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
