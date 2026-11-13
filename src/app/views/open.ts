/** Opening a received message with the inbox passkey. */

import { rpIdProblem } from "../../config";
import { fromBase64Url, isWellFormed } from "../../crypto";
import { h } from "../dom";
import { fragmentFromPaste } from "../links";
import { openMessage } from "../payload";
import { currentInbox, passkeyErrorMessage, unlockInbox } from "../session";
import { actions, backLink, button, copyButton, field, messageSlot, notice, page, title } from "../ui";

/** Distinguishes "not for this inbox" from passkey trouble and broken links. */
function decryptErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";
  if (message.includes("wrong key")) {
    return (
      "This message wasn't sent to the inbox you unlocked. " +
      "If you have more than one Send Me Safe passkey, try again and choose another one."
    );
  }
  if (/truncated|base64url|version|damaged|format/i.test(message)) {
    return (
      "This message link is incomplete or damaged. E-mail programs sometimes break long links. " +
      "Copy the complete link from the e-mail and paste it below, or ask the sender to send it again."
    );
  }
  return passkeyErrorMessage(error);
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
      slot.show(value ? notice("error", "That doesn't look like a message link. It should contain “#m=”.") : null);
    }
  });
  return h("div", null, field("Paste the message link", input), slot.el);
}

export function openView(envelope?: string): HTMLElement {
  if (!envelope) {
    return page(
      backLink(),
      title("Open a secure message", "If clicking the link in the e-mail didn't work, copy the whole link and paste it here."),
      h("section", { class: "card" }, pasteField()),
    );
  }

  if (!wellFormed(envelope)) {
    return page(
      backLink(),
      title("This message link is incomplete"),
      notice(
        "error",
        "Part of the link seems to be missing. E-mail programs sometimes break long links. ",
        "Copy the complete link from the e-mail and paste it below, or ask the sender to send it again.",
      ),
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
      const { text } = await openMessage(inbox, envelope!);
      content.replaceChildren(
        title("Your secure message"),
        h(
          "section",
          { class: "card" },
          h("div", { class: "message", "data-testid": "message-text" }, text),
          actions(copyButton("Copy text", () => text)),
        ),
        h(
          "p",
          { class: "help" },
          "This message stays encrypted in your e-mail. Open the link again whenever you want to read it. ",
          h("a", { href: "#inbox" }, "Show my secure link"),
        ),
      );
      content.querySelector("h1")?.focus();
    } catch (error) {
      slot.show(notice("error", decryptErrorMessage(error)));
      if (/incomplete or damaged/.test(decryptErrorMessage(error))) {
        slot.el.append(pasteField());
      }
    }
  }

  const openButton = button("Open message", () => reveal(false), { icon: "key", testId: "open-message" });
  if (problem) {
    openButton.disabled = true;
    slot.show(notice("error", problem));
  }

  content.append(
    title("You've received a secure message", "It can only be opened with the passkey of your secure inbox."),
    h(
      "section",
      { class: "card" },
      h("p", null, "Click the button and confirm with Face ID, fingerprint or your device PIN."),
      actions(openButton),
      slot.el,
    ),
    h(
      "p",
      { class: "help" },
      "Don't have a secure inbox? Then this message wasn't meant for you, or the sender used the wrong link.",
    ),
  );

  // Already unlocked during this visit: show the message without another prompt.
  if (currentInbox() && !problem) {
    void reveal(true);
  }

  return page(backLink(), content);
}
