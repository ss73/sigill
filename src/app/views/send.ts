/** "Send a secure message" without a recipient link yet: paste one, or ask for one. */

import { h } from "../dom";
import { lang, messagesFor, t, type Lang } from "../i18n";
import { clearContacts, contacts, contactsEnabled, forgetContact, setContactsEnabled } from "../contacts";
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
 * People written to or heard from, one click from writing again. Shown once
 * there is someone, or while remembering is off (to switch it back on).
 */
function contactsCard(): HTMLElement {
  const holder = h("div");
  let toggled = false; // keeps the card in place after switching it back on
  function render(): void {
    const enabled = contactsEnabled();
    const people = contacts();
    if (enabled && !people.length && !toggled) {
      holder.replaceChildren();
      return;
    }
    const remember = h("input", { type: "checkbox", checked: enabled, "data-testid": "remember-contacts" });
    remember.addEventListener("change", () => {
      setContactsEnabled(remember.checked);
      toggled = true;
      render();
      holder.querySelector<HTMLInputElement>("input[type=checkbox]")?.focus();
    });
    holder.replaceChildren(
      h(
        "section",
        { class: "card" },
        h("h2", null, t.send.contactsTitle),
        people.length
          ? h(
              "ul",
              { class: "contacts", "data-testid": "contacts" },
              ...people.map((person) => {
                const name = person.email ?? t.inbox.unnamed;
                const remove = button(t.compose.replyRemove, () => {
                  forgetContact(person.publicKey);
                  render();
                }, { variant: "text" });
                remove.setAttribute("aria-label", `${t.compose.replyRemove}: ${name}`);
                return h("li", null, h("a", { href: inboxHash(person.publicKey, person.email) }, name), remove);
              }),
            )
          : null,
        h("label", { class: "check" }, remember, t.send.rememberContacts),
        h("p", { class: "help" }, t.send.contactsHelp),
        people.length
          ? actions(button(t.send.forgetContacts, () => {
              clearContacts();
              render();
            }, { variant: "text", testId: "forget-contacts" }))
          : null,
      ),
    );
  }
  render();
  return holder;
}
