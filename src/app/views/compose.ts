/** Writing to an inbox: the page a secure link opens. No passkey needed. */

import { fingerprint } from "../../crypto";
import { h } from "../dom";
import { lang, messagesFor, t, type Lang } from "../i18n";
import { appBase, isEmail, messageLink } from "../links";
import { asText, fitsMailto, mailto, messageEmail, type Email } from "../mail";
import { sealMessage, type ReplyTo } from "../payload";
import { createInbox, knownInbox, passkeyErrorMessage, sessionEmail, unlockInbox, type KnownInbox } from "../session";
import { PasskeyError } from "../../passkey";
import { actions, backLink, button, copyButton, field, languageSelect, linkButton, messageSlot, notice, page, securityCode, title } from "../ui";

export function composeView(to: Uint8Array, recipientEmail?: string): HTMLElement {
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
  // address is just the public link, so no passkey prompt is needed.
  let replyInbox: KnownInbox | null = knownInbox();
  const replyPanel = h("div", { class: "reply", "data-testid": "reply-panel" });
  const replySlot = messageSlot();

  async function attach(action: () => Promise<unknown>): Promise<void> {
    replySlot.show(null);
    try {
      await action();
      replyInbox = knownInbox();
      renderReply();
      void update();
    } catch (error) {
      const cancelled = error instanceof PasskeyError && error.code === "cancelled";
      replySlot.show(cancelled ? createOffer() : notice("error", passkeyErrorMessage(error)));
    }
  }

  /** No inbox yet: create one right here, keeping the draft. */
  function createOffer(): HTMLElement {
    const ownEmail = h("input", {
      type: "email",
      autocomplete: "email",
      required: true,
      placeholder: t.common.emailPlaceholder,
      value: sessionEmail() ?? "",
      "data-testid": "reply-own-email",
    });
    const offerSlot = messageSlot();
    const create = button(
      t.compose.replyCreate,
      () => {
        const own = ownEmail.value.trim();
        if (!isEmail(own)) {
          offerSlot.show(notice("error", t.inbox.emailMissing));
          ownEmail.focus();
          return;
        }
        return attach(() => createInbox(own));
      },
      { variant: "secondary", icon: "key", testId: "reply-create" },
    );
    const unlock = button(t.compose.replyHaveInbox, () => attach(unlockInbox), { variant: "text", testId: "reply-unlock" });
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

  function renderReply(): void {
    if (replyInbox) {
      replyPanel.replaceChildren(
        notice(
          "success",
          h("strong", null, t.compose.replyOn),
          t.compose.replyOnText(recipientEmail),
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
  let emailLang: Lang = lang();

  function replyTo(): ReplyTo | undefined {
    if (!replyInbox) {
      return undefined;
    }
    return { key: replyInbox.publicKey, email: replyInbox.email ?? sessionEmail() };
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

  return page(
    backLink(),
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
      actions(send, copyButton(t.compose.copyInstead, () => (email ? asText(email) : ""), { testId: "copy-message" })),
      slot.el,
      codeSlot,
    ),
  );
}

export function brokenLinkView(): HTMLElement {
  return page(
    backLink(),
    title(t.compose.brokenTitle),
    notice("error", t.compose.brokenText, h("a", { href: "#send" }, t.compose.brokenSendPage), t.compose.brokenEnd),
  );
}
