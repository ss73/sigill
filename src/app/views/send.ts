/** "Send a secure message" without a recipient link yet: paste one, or ask for one. */

import { h } from "../dom";
import { lang, messagesFor, t, type Lang } from "../i18n";
import { appBase, cleanEmail, fragmentFromPaste, inviteLink } from "../links";
import { asText, inviteEmail, mailto, type Email } from "../mail";
import { actions, backLink, copyButton, field, languageSelect, linkButton, messageSlot, notice, page, title } from "../ui";

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
      pasteSlot.show(value ? notice("error", t.send.notALink) : null);
    }
  });

  // --- Ask for a link ----------------------------------------------------------
  const theirEmail = h("input", { type: "email", autocomplete: "off", placeholder: t.send.theirEmailPlaceholder, "data-testid": "ask-their-email" });
  const yourEmail = h("input", { type: "email", autocomplete: "email", placeholder: t.common.emailPlaceholder, "data-testid": "ask-your-email" });
  const askSlot = messageSlot();
  const ask = linkButton(t.send.ask, "#", { icon: "mail", testId: "ask-send" });
  let emailLang: Lang = lang();
  let invitation: Email | null = null;
  let sequence = 0;

  async function updateAsk(): Promise<void> {
    const mine = ++sequence;
    const them = cleanEmail(theirEmail.value);
    const me = cleanEmail(yourEmail.value);
    const m = await messagesFor(emailLang);
    if (mine !== sequence) {
      return; // a newer change won
    }
    const link = inviteLink(appBase(), { reply: me, email: them, lang: emailLang });
    invitation = inviteEmail(link, m);
    ask.href = mailto(them, invitation);
  }
  theirEmail.addEventListener("input", () => void updateAsk());
  yourEmail.addEventListener("input", () => void updateAsk());
  const languageField = field(
    t.common.emailLanguage,
    languageSelect(emailLang, (code) => {
      emailLang = code;
      void updateAsk();
    }, "ask-language"),
  );
  void updateAsk();

  ask.addEventListener("click", () => {
    askSlot.show(notice("success", t.send.asked));
  });

  return page(
    backLink(),
    title(t.send.title, t.send.lead),
    h(
      "section",
      { class: "card" },
      h("h2", null, t.send.haveLink),
      field(t.send.pasteLabel, linkInput, t.send.pasteHelp),
      pasteSlot.el,
    ),
    h(
      "section",
      { class: "card" },
      h("h2", null, t.send.noLinkYet),
      h("p", null, t.send.noLinkText),
      field(t.send.theirEmail, theirEmail),
      field(t.common.yourEmail, yourEmail, t.send.yourEmailHelp),
      languageField,
      actions(ask, copyButton(t.send.copyInvitation, () => (invitation ? asText(invitation) : ""))),
      askSlot.el,
    ),
  );
}
