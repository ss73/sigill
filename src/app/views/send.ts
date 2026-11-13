/** "Send a secure message" without a recipient link yet: paste one, or ask for one. */

import { h } from "../dom";
import { appBase, fragmentFromPaste, inviteLink, isEmail } from "../links";
import { asText, inviteEmail, mailto } from "../mail";
import { actions, backLink, copyButton, field, linkButton, messageSlot, notice, page, title } from "../ui";

export function sendView(): HTMLElement {
  // --- Paste an existing secure link -----------------------------------------
  const pasteSlot = messageSlot();
  const linkInput = h("input", {
    type: "url",
    placeholder: "https://…#to=…",
    autocomplete: "off",
    spellcheck: false,
    "data-testid": "recipient-link",
  });
  linkInput.addEventListener("input", () => {
    const value = linkInput.value.trim();
    const hash = value ? fragmentFromPaste(value) : null;
    if (hash?.startsWith("#to=")) {
      location.hash = hash;
    } else {
      pasteSlot.show(value ? notice("error", "That doesn't look like a secure link. It should contain “#to=”.") : null);
    }
  });

  // --- Ask for a link ----------------------------------------------------------
  const theirEmail = h("input", { type: "email", autocomplete: "off", placeholder: "their@email.com", "data-testid": "ask-their-email" });
  const yourEmail = h("input", { type: "email", autocomplete: "email", placeholder: "you@email.com", "data-testid": "ask-your-email" });
  const askSlot = messageSlot();
  const ask = linkButton("Ask by e-mail", "#", { icon: "mail", testId: "ask-send" });
  let invitation = inviteEmail(inviteLink(appBase(), {}));

  function updateAsk(): void {
    const them = theirEmail.value.trim();
    const me = yourEmail.value.trim();
    invitation = inviteEmail(inviteLink(appBase(), { reply: isEmail(me) ? me : undefined, email: isEmail(them) ? them : undefined }));
    ask.href = mailto(isEmail(them) ? them : undefined, invitation);
  }
  theirEmail.addEventListener("input", updateAsk);
  yourEmail.addEventListener("input", updateAsk);
  updateAsk();

  ask.addEventListener("click", () => {
    askSlot.show(
      notice(
        "success",
        "Your e-mail program should open with the invitation ready to send. ",
        "When they reply with their secure link, just click it to write your message.",
      ),
    );
  });

  return page(
    backLink(),
    title("Send a secure message", "To write securely, you need the recipient's secure link."),
    h(
      "section",
      { class: "card" },
      h("h2", null, "I have their secure link"),
      field("Paste the link here", linkInput, "Or simply click the link in their e-mail."),
      pasteSlot.el,
    ),
    h(
      "section",
      { class: "card" },
      h("h2", null, "They don't have one yet"),
      h("p", null, "Send them a short invitation. They create their inbox in half a minute and send their link back to you."),
      field("Their e-mail address", theirEmail),
      field("Your e-mail address", yourEmail, "So they can send their link straight back to you."),
      actions(ask, copyButton("Copy invitation", () => asText(invitation))),
      askSlot.el,
    ),
  );
}
