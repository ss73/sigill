/** "Send a secure message" without a recipient link yet: paste one, or ask for one. */

import { h } from "../dom";
import { lang, messagesFor, t, type Lang } from "../i18n";
import { CONTACTS_CHANGED, contacts, forgetContact } from "../contacts";
import { appBase, cleanEmail, fragmentFromPaste, inboxHash, inviteLink } from "../links";
import { asText, inviteEmail, mailto, type Email } from "../mail";
import { emailOf, knownInboxes } from "../session";
import { actions, button, copyButton, field, languageSelect, linkButton, messageSlot, notice, page, title } from "../ui";

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
  // The user's own addresses, the one in use first, or any typed one. (Not
  // field suggestions: Chrome only lists those matching what's typed.)
  const addresses = knownInboxes().map(emailOf).filter((email): email is string => Boolean(email));
  const OTHER = "";
  const yourAddress = h(
    "select",
    { "data-testid": "ask-your-address" },
    ...addresses.map((email) => h("option", { value: email }, email)),
    h("option", { value: OTHER }, t.send.otherAddress),
  );
  const yourEmail = h("input", {
    type: "email",
    autocomplete: "email",
    placeholder: t.common.emailPlaceholder,
    "aria-label": t.send.yourEmailOptional,
    hidden: addresses.length > 0,
    "data-testid": "ask-your-email",
  });
  yourAddress.addEventListener("change", () => {
    yourEmail.hidden = yourAddress.value !== OTHER;
    if (!yourEmail.hidden) {
      yourEmail.focus();
    }
    void updateAsk();
  });
  const askSlot = messageSlot();
  const ask = linkButton(t.send.ask, "#", { icon: "mail", testId: "ask-send" });
  let emailLang: Lang = lang();
  let invitation: Email | null = null;
  let sequence = 0;

  async function updateAsk(): Promise<void> {
    const mine = ++sequence;
    const them = cleanEmail(theirEmail.value);
    const me = addresses.length && yourAddress.value !== OTHER ? yourAddress.value : cleanEmail(yourEmail.value);
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
    title(t.send.title, t.send.lead),
    contactsCard(),
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
      addresses.length ? ownAddressField(yourAddress, yourEmail) : field(t.send.yourEmailOptional, yourEmail, t.send.yourEmailHelp),
      languageField,
      actions(ask, copyButton(t.send.copyInvitation, () => (invitation ? asText(invitation) : ""))),
      askSlot.el,
    ),
  );
}

/** The list of the user's addresses, with a field for another right under it. */
function ownAddressField(list: HTMLSelectElement, other: HTMLInputElement): HTMLElement {
  const el = field(t.common.yourEmail, list, t.send.yourEmailHelp);
  list.after(other);
  return el;
}

/**
 * People written to or heard from, one click from writing again. Hidden when
 * there's nobody (or remembering is off, in the settings menu), and kept in
 * step with changes made there.
 */
function contactsCard(): HTMLElement {
  const holder = h("div");

  function render(): void {
    const people = contacts();
    holder.replaceChildren(
      ...(people.length
        ? [h(
            "section",
            { class: "card" },
            h("h2", null, t.send.contactsTitle),
            h(
              "ul",
              { class: "contacts", "data-testid": "contacts" },
              ...people.map((person) => {
                const name = person.email ?? t.inbox.unnamed;
                const remove = button(t.compose.replyRemove, () => forgetContact(person.publicKey), { variant: "text" });
                remove.setAttribute("aria-label", `${t.compose.replyRemove}: ${name}`);
                return h("li", null, h("a", { href: inboxHash(person.publicKey, person.email) }, name), remove);
              }),
            ),
          )]
        : []),
    );
  }
  function onChange(): void {
    if (holder.isConnected) {
      render();
    } else {
      window.removeEventListener(CONTACTS_CHANGED, onChange); // the page was left
    }
  }
  render();
  window.addEventListener(CONTACTS_CHANGED, onChange);
  return holder;
}
