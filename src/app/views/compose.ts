/** Writing to an inbox: the page a secure link opens. No passkey needed. */

import { fingerprint, type Bytes } from "../../crypto";
import { h } from "../dom";
import { lang, messagesFor, t, type Lang } from "../i18n";
import { conflictFor, contactFor, rememberContact } from "../contacts";
import { appBase, cleanEmail, inboxHash, messageLink } from "../links";
import { asText, fitsMailto, mailto, messageEmail, type Email } from "../mail";
import { sealMessage, type ReplyTo } from "../payload";
import {
  createInbox,
  emailOf,
  knownInbox,
  knownInboxes,
  passkeyErrorMessage,
  sessionEmail,
  setInboxEmail,
  suggestedInbox,
  unlockInbox,
  useInbox,
  type KnownInbox,
} from "../session";
import { PasskeyError } from "../../passkey";
import { actions, button, copyButton, field, languageSelect, linkButton, messageSlot, notice, page, securityCode, title } from "../ui";

export function composeView(to: Bytes, recipientEmail?: string): HTMLElement {
  const textarea = h("textarea", {
    rows: 8,
    placeholder: t.compose.placeholder,
    "data-testid": "message",
  });
  const send = linkButton(t.compose.sendEmail, "#", { icon: "mail", testId: "send-email" });
  send.setAttribute("aria-disabled", "true");
  const status = h("p", { class: "help", "data-testid": "compose-status" }, t.compose.encryptsAsYouType);
  const slot = messageSlot();
  const codeSlot = h("div");

  // --- Secure reply ------------------------------------------------------------
  // On by default whenever this browser knows the user's inbox: a reply
  // address is just the public link, so no passkey prompt is needed. With
  // several, it starts with the one in use (after opening a message: the one
  // it was sent to).
  let replyInbox: KnownInbox | null = knownInbox();
  const replyPanel = h("div", { class: "reply", "data-testid": "reply-panel" });
  const replySlot = messageSlot();

  function replyOn(): void {
    replySlot.show(null);
    replyInbox = knownInbox();
    renderReply();
    void update();
  }

  async function attach(action: () => Promise<unknown>): Promise<void> {
    replySlot.show(null);
    try {
      await action();
      replyOn();
    } catch (error) {
      const cancelled = error instanceof PasskeyError && error.code === "cancelled";
      replySlot.show(cancelled ? createOffer() : notice("error", passkeyErrorMessage(error)));
    }
  }

  /** No inbox yet: create one right here, keeping the draft. */
  function createOffer(): HTMLElement {
    const ownEmail = h("input", {
      type: "email",
      // Offers an existing inbox passkey right here, before a duplicate is made.
      autocomplete: "email webauthn",
      required: true,
      placeholder: t.common.emailPlaceholder,
      value: sessionEmail() ?? "",
      "data-testid": "reply-own-email",
    });
    const offerSlot = messageSlot();
    const create = button(
      t.compose.replyCreate,
      () => {
        const own = cleanEmail(ownEmail.value);
        if (!own) {
          offerSlot.show(notice("error", t.inbox.emailMissing));
          ownEmail.focus();
          return;
        }
        return attach(() => createInbox(own));
      },
      { variant: "secondary", icon: "key", testId: "reply-create" },
    );
    const unlock = button(t.compose.replyHaveInbox, () => attach(unlockInbox), { variant: "text", testId: "reply-unlock" });
    queueMicrotask(async () => {
      try {
        if (await suggestedInbox()) {
          replyOn();
        }
      } catch (error) {
        if (!(error instanceof PasskeyError && error.code === "cancelled")) {
          offerSlot.show(notice("error", passkeyErrorMessage(error)));
        }
      }
    });
    return notice("info", h("div", null, t.compose.replyNoInbox, field(t.common.yourEmail, ownEmail), actions(create, unlock), offerSlot.el));
  }

  /**
   * Turning reply on. A browser that knows the inbox needs no passkey. One
   * that doesn't offers to create an inbox first: asking for an existing
   * passkey on a device without one makes the browser offer a QR code for
   * another device, which looks like a dead end to someone who has none.
   */
  function addReply(): void {
    if (knownInbox()) {
      void attach(async () => {});
    } else {
      replySlot.show(createOffer());
    }
  }

  // Only passkeys from before e-mail was required lack it, opened in a
  // browser that doesn't know the address either. Without it the reply
  // would reach the right inbox but leave the e-mail's "To" empty.
  function replyEmailField(): HTMLElement {
    const input = h("input", {
      type: "email",
      autocomplete: "email",
      required: true,
      placeholder: t.common.emailPlaceholder,
      "data-testid": "reply-email",
    });
    input.addEventListener("input", () => {
      setInboxEmail(input.value);
      replyInbox = knownInbox();
      void update();
    });
    return field(t.common.yourEmail, input, t.inbox.linkEmailHelp);
  }

  /** Which of the user's addresses replies go to. */
  function replyAddressField(current: KnownInbox): HTMLElement {
    const inboxes = knownInboxes();
    const select = h(
      "select",
      { "data-testid": "reply-address" },
      ...inboxes.map((inbox, i) =>
        h("option", { value: String(i), selected: inbox === current }, emailOf(inbox) ?? t.inbox.unnamed),
      ),
    );
    select.addEventListener("change", () => {
      const picked = inboxes[Number(select.value)];
      if (picked) {
        useInbox(picked.publicKey);
        replyInbox = picked;
        renderReply();
        void update();
      }
    });
    return field(t.compose.replyAddress, select);
  }

  function renderReply(): void {
    if (replyInbox) {
      replyPanel.replaceChildren(
        notice(
          "success",
          h("strong", null, t.compose.replyOn),
          t.compose.replyOnText(recipientEmail),
          knownInboxes().length > 1 ? replyAddressField(replyInbox) : null,
          emailOf(replyInbox) ? null : replyEmailField(),
          button(
            t.compose.replyRemove,
            () => {
              replyInbox = null;
              renderReply();
              void update();
            },
            { variant: "text", testId: "reply-remove" },
          ),
        ),
      );
    } else {
      replyPanel.replaceChildren(
        actions(
          button(t.compose.replyAdd, addReply, {
            variant: "secondary",
            icon: "key",
            testId: "reply-add",
          }),
        ),
        h("p", { class: "help" }, t.compose.replyAddHelp),
        replySlot.el,
      );
    }
  }
  renderReply();

  // --- Encrypt as you type --------------------------------------------------------
  let email: Email | null = null;
  let fits = true;
  let sequence = 0;
  let emailLang: Lang = contactFor(to)?.lang ?? lang();

  function replyTo(): ReplyTo | undefined {
    if (!replyInbox) {
      return undefined;
    }
    return { key: replyInbox.publicKey, email: emailOf(replyInbox) };
  }

  async function update(): Promise<void> {
    const mine = ++sequence;
    const text = textarea.value;
    if (!text.trim()) {
      email = null;
      send.href = "#";
      send.setAttribute("aria-disabled", "true");
      status.textContent = t.compose.encryptsAsYouType;
      return;
    }
    const [envelope, m] = await Promise.all([
      sealMessage(to, { text, replyTo: replyTo(), to: recipientEmail }),
      messagesFor(emailLang),
    ]);
    if (mine !== sequence) {
      return; // a newer change won
    }
    email = messageEmail(messageLink(appBase(), envelope, emailLang), m);
    const full = mailto(recipientEmail, email);
    fits = fitsMailto(full);
    send.href = fits ? full : mailto(recipientEmail, { subject: email.subject });
    send.removeAttribute("aria-disabled");
    status.textContent = fits
      ? t.compose.encrypted(recipientEmail)
      : `${t.compose.encrypted(recipientEmail)} ${t.compose.tooLongForMailto}`;
  }
  textarea.addEventListener("input", () => void update());

  /** Sent (or copied to send): from now on this person is known. */
  function sent(): void {
    const own = knownInboxes().some((inbox) => inboxHash(inbox.publicKey) === inboxHash(to));
    if (!own) {
      rememberContact({ publicKey: to, email: recipientEmail, lang: emailLang });
    }
  }

  send.addEventListener("click", (event) => {
    if (!email) {
      event.preventDefault();
      textarea.focus();
      return;
    }
    sent();
    // Copy as well: covers webmail users whose browser has no mail program set up.
    void navigator.clipboard?.writeText(fits ? asText(email) : email.body).catch(() => {});
    slot.show(
      fits
        ? notice("success", t.compose.sent(recipientEmail))
        : notice("info", t.compose.copiedForPaste),
    );
  });

  void fingerprint(to).then((code) =>
    codeSlot.replaceChildren(
      securityCode(
        code,
        t.compose.codeHelp(recipientEmail),
      ),
    ),
  );

  const view = page(
    title(t.compose.title(recipientEmail), t.compose.lead),
    h(
      "section",
      { class: "card" },
      field(t.compose.messageLabel, textarea),
      replyPanel,
      field(
        t.common.emailLanguage,
        languageSelect(emailLang, (code) => {
          emailLang = code;
          void update();
        }, "email-language"),
      ),
      status,
      actions(
        send,
        copyButton(
          t.compose.copyInstead,
          () => {
            if (email) {
              sent();
            }
            return email ? asText(email) : "";
          },
          { testId: "copy-message" },
        ),
      ),
      slot.el,
      codeSlot,
    ),
  );
  const conflict = conflictFor(to, recipientEmail);
  if (conflict) {
    holdForChangedLink(view, conflict.publicKey, to, recipientEmail!);
  }
  return view;
}

/**
 * A known address with a different key: someone may have swapped the link.
 * Writing waits until the user picks the new link or goes back to the known one.
 */
function holdForChangedLink(view: HTMLElement, known: Bytes, to: Bytes, recipientEmail: string): void {
  const card = view.querySelector<HTMLElement>(".card")!;
  card.hidden = true;
  const codes = h("div", { class: "codes" });
  void Promise.all([fingerprint(known), fingerprint(to)]).then(([before, now]) =>
    codes.replaceChildren(
      h("p", null, `${t.compose.knownCode}: `, h("code", { "data-testid": "known-code" }, before)),
      h("p", null, `${t.compose.newCode}: `, h("code", { "data-testid": "new-code" }, now)),
    ),
  );
  const warning = notice(
    "error",
    h("strong", null, t.compose.keyChangedTitle),
    h("p", null, t.compose.keyChanged(recipientEmail)),
    codes,
    actions(
      linkButton(t.compose.useKnown, inboxHash(known, recipientEmail), { testId: "use-known-link" }),
      button(
        t.compose.useNew,
        () => {
          rememberContact({ publicKey: to, email: recipientEmail });
          warning.remove();
          card.hidden = false;
          card.querySelector("textarea")?.focus();
        },
        { variant: "secondary", testId: "use-new-link" },
      ),
    ),
  );
  warning.dataset.testid = "key-changed";
  card.before(warning);
}

export function brokenLinkView(): HTMLElement {
  return page(
    title(t.compose.brokenTitle),
    notice("error", t.compose.brokenText, h("a", { href: "#send" }, t.compose.brokenSendPage), t.compose.brokenEnd),
  );
}
