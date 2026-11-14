/** Opening a received message with the inbox passkey. */

import { rpIdProblem } from "../../config";
import { fromBase64Url, isWellFormed } from "../../crypto";
import { h } from "../dom";
import { t } from "../i18n";
import { fragmentFromPaste, inboxHash } from "../links";
import { openMessage } from "../payload";
import { currentInbox, passkeyErrorMessage, sessionEmail, setSessionEmail, unlockInbox } from "../session";
import { actions, backLink, button, copyButton, field, linkButton, messageSlot, notice, page, title } from "../ui";

/** Distinguishes "not for this inbox" from passkey trouble and broken links. */
function decryptProblem(error: unknown): "wrong-inbox" | "damaged" | "passkey" {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("wrong key")) {
    return "wrong-inbox";
  }
  if (/truncated|base64url|version|damaged|format/i.test(message)) {
    return "damaged";
  }
  return "passkey";
}

function wellFormed(envelope: string): boolean {
  try {
    return isWellFormed(fromBase64Url(envelope));
  } catch {
    return false;
  }
}

function pasteField(): HTMLElement {
  const input = h("input", { type: "url", placeholder: "https://…#m=…", autocomplete: "off", spellcheck: false, "data-testid": "paste-message" });
  const slot = messageSlot();
  input.addEventListener("input", () => {
    const value = input.value.trim();
    const hash = value ? fragmentFromPaste(value) : null;
    if (hash?.startsWith("#m=")) {
      location.hash = hash;
    } else {
      slot.show(value ? notice("error", t.open.notALink) : null);
    }
  });
  return h("div", null, field(t.open.pasteLabel, input), slot.el);
}

export function openView(envelope?: string): HTMLElement {
  if (!envelope) {
    return page(
      backLink(),
      title(t.open.pasteTitle, t.open.pasteLead),
      h("section", { class: "card" }, pasteField()),
    );
  }

  if (!wellFormed(envelope)) {
    return page(
      backLink(),
      title(t.open.incompleteTitle),
      notice("error", t.open.incomplete),
      h("section", { class: "card" }, pasteField()),
    );
  }

  const content = h("div");
  const slot = messageSlot();
  const problem = rpIdProblem();

  async function reveal(useCurrent: boolean): Promise<void> {
    slot.show(null);
    try {
      const inbox = (useCurrent && currentInbox()) || (await unlockInbox());
      const { text, replyTo, to } = await openMessage(inbox, envelope!);
      if (to && !sessionEmail()) {
        setSessionEmail(to); // lets a reply carry the reader's address back
      }
      content.replaceChildren(
        title(t.open.messageTitle, replyTo?.email ? t.open.from(replyTo.email) : undefined),
        h(
          "section",
          { class: "card" },
          h("div", { class: "message", "data-testid": "message-text" }, text),
          actions(
            replyTo
              ? linkButton(t.open.reply, inboxHash(replyTo.key, replyTo.email), { icon: "send", testId: "reply" })
              : null,
            copyButton(t.open.copyText, () => text),
          ),
          replyTo
            ? null
            : h(
                "p",
                { class: "help", "data-testid": "no-reply" },
                t.open.noReply,
              ),
        ),
        h(
          "p",
          { class: "help" },
          t.open.staysEncrypted,
          h("a", { href: "#inbox" }, t.open.showMyLink),
        ),
      );
      content.querySelector("h1")?.focus();
    } catch (error) {
      const problem = decryptProblem(error);
      slot.show(
        notice(
          "error",
          problem === "wrong-inbox" ? t.open.wrongInbox : problem === "damaged" ? t.open.damaged : passkeyErrorMessage(error),
        ),
      );
      if (problem === "damaged") {
        slot.el.append(pasteField());
      }
    }
  }

  const openButton = button(t.open.openButton, () => reveal(false), { icon: "key", testId: "open-message" });
  if (problem) {
    openButton.disabled = true;
    slot.show(notice("error", problem));
  }

  content.append(
    title(t.open.receivedTitle, t.open.receivedLead),
    h(
      "section",
      { class: "card" },
      h("p", null, t.open.instructions),
      actions(openButton),
      slot.el,
    ),
    h(
      "p",
      { class: "help" },
      t.open.notForYou,
    ),
  );

  // Already unlocked during this visit: show the message without another prompt.
  if (currentInbox() && !problem) {
    void reveal(true);
  }

  return page(backLink(), content);
}
