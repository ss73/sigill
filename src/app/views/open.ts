/** Opening a received message with the inbox passkey. */

import { rpIdProblem } from "../../config";
import { fromBase64Url, isWellFormed } from "../../crypto";
import { h } from "../dom";
import { t } from "../i18n";
import { fragmentFromPaste, inboxHash, isMessageFragment, linkIntact } from "../links";
import { openMessage } from "../payload";
import { passkeyErrorMessage, knownInboxes, setReaderEmail, unlockInbox, unlockedInboxes, useInbox } from "../session";
import { conflictFor, rememberContact } from "../contacts";
import type { InboxKeyPair } from "../../crypto";
import { actions, button, copyButton, field, linkButton, messageSlot, notice, page, title } from "../ui";

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
  const input = h("input", { type: "url", placeholder: "https://…#c=…&m=…", autocomplete: "off", spellcheck: false, "data-testid": "paste-message" });
  const slot = messageSlot();
  input.addEventListener("input", () => {
    const value = input.value.trim();
    const hash = value ? fragmentFromPaste(value) : null;
    if (hash && isMessageFragment(hash)) {
      location.hash = hash;
    } else {
      slot.show(value ? notice("error", t.open.notALink) : null);
    }
  });
  return h("div", null, field(t.open.pasteLabel, input), slot.el);
}

export function openView(envelope?: string, check?: string): HTMLElement {
  if (!envelope) {
    return page(
      title(t.open.pasteTitle, t.open.pasteLead),
      h("section", { class: "card" }, pasteField()),
    );
  }

  // A link that arrived intact can only fail to open because it's for another inbox.
  const intact = linkIntact(envelope, check);
  if (!wellFormed(envelope) || intact === false) {
    return page(
      title(t.open.incompleteTitle),
      notice("error", t.open.incomplete),
      h("section", { class: "card" }, pasteField()),
    );
  }

  const content = h("div");
  const slot = messageSlot();
  const problem = rpIdProblem();

  /** An inbox already unlocked during this visit that the message is for. */
  async function openUnlocked(): Promise<{ inbox: InboxKeyPair; opened: Awaited<ReturnType<typeof openMessage>> } | null> {
    for (const inbox of unlockedInboxes()) {
      try {
        return { inbox, opened: await openMessage(inbox, envelope!) };
      } catch (error) {
        if (decryptProblem(error) !== "wrong-inbox") {
          throw error;
        }
      }
    }
    return null;
  }

  /** Without a passkey prompt if one of this visit's unlocked inboxes fits. */
  async function reveal(withPasskey: boolean): Promise<void> {
    slot.show(null);
    try {
      let found = await openUnlocked();
      if (!found && withPasskey) {
        const inbox = await unlockInbox();
        found = { inbox, opened: await openMessage(inbox, envelope!) };
      }
      if (!found) {
        return;
      }
      const { text, replyTo, to } = found.opened;
      // A reply from here comes from this inbox.
      useInbox(found.inbox.publicKey);
      if (to) {
        setReaderEmail(found.inbox.publicKey, to); // for an inbox that doesn't know its address
      }
      // The sender's reply link: remembered, unless it contradicts the one known for them.
      const changed = replyTo && conflictFor(replyTo.key, replyTo.email);
      const own = replyTo && knownInboxes().some((inbox) => inboxHash(inbox.publicKey) === inboxHash(replyTo.key));
      if (replyTo && !changed && !own) {
        rememberContact({ publicKey: replyTo.key, email: replyTo.email });
      }
      const senderWarning = changed && replyTo.email ? notice("error", t.open.keyChanged(replyTo.email)) : null;
      senderWarning?.setAttribute("data-testid", "sender-changed");
      content.replaceChildren(
        title(t.open.messageTitle, replyTo?.email ? t.open.from(replyTo.email) : undefined),
        h(
          "section",
          { class: "card" },
          senderWarning,
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
          problem === "wrong-inbox" ? (intact ? t.open.wrongInbox : t.open.wrongInboxOrDamaged) : problem === "damaged" ? t.open.damaged : passkeyErrorMessage(error),
        ),
      );
      if (problem === "damaged" || (problem === "wrong-inbox" && !intact)) {
        slot.el.append(pasteField());
      }
    }
  }

  const openButton = button(t.open.openButton, () => reveal(true), { icon: "key", testId: "open-message" });
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
  if (unlockedInboxes().length && !problem) {
    void reveal(false);
  }

  return page(content);
}
