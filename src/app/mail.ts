/**
 * E-mail templates and mailto: links.
 *
 * Long mailto: URLs are silently truncated or refused by some mail programs
 * (Outlook on Windows around 2000 characters), so callers check fitsMailto()
 * and fall back to copy & paste for long messages.
 */

import type { Messages } from "./i18n";

export const MAILTO_LIMIT = 1800;

export interface Email {
  subject: string;
  body: string;
}

export function mailto(to: string | undefined, email: Partial<Email>): string {
  const params: string[] = [];
  if (email.subject) {
    params.push(`subject=${encodeURIComponent(email.subject)}`);
  }
  if (email.body) {
    params.push(`body=${encodeURIComponent(email.body.replace(/\r?\n/g, "\r\n"))}`);
  }
  const address = to ? encodeURIComponent(to).replace(/%40/g, "@") : "";
  return `mailto:${address}${params.length ? `?${params.join("&")}` : ""}`;
}

export function fitsMailto(url: string): boolean {
  return url.length <= MAILTO_LIMIT;
}

export function messageEmail(link: string, m: Messages): Email {
  return { subject: m.mail.messageSubject, body: m.mail.messageBody(link) };
}

export function inviteEmail(link: string, m: Messages): Email {
  return { subject: m.mail.inviteSubject, body: m.mail.inviteBody(link) };
}

export function inboxLinkEmail(link: string, m: Messages): Email {
  return { subject: m.mail.linkSubject, body: m.mail.linkBody(link) };
}

/** The whole e-mail as plain text, for copying into webmail. */
export function asText(email: Email): string {
  return `${email.subject}\n\n${email.body}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

/**
 * A signature block for pasting into Gmail, Outlook or Apple Mail. Mail
 * programs drop SVG, data: images and stylesheets, so it uses a hosted PNG,
 * inline styles and a table for layout.
 */
export function signature(link: string, imageUrl: string, m: Messages): { text: string; html: string } {
  const href = escapeHtml(link);
  return {
    text: `${m.mail.signature}: ${link}`,
    html:
      `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse"><tr>` +
      `<td style="padding:0 8px 0 0;vertical-align:middle"><a href="${href}"><img src="${escapeHtml(imageUrl)}" width="32" height="32" alt="Sigill" style="display:block;border:0"></a></td>` +
      `<td style="vertical-align:middle;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.3">` +
      `<a href="${href}" style="color:#b3172f;font-weight:bold;text-decoration:none">${escapeHtml(m.mail.signature)}</a><br>` +
      `<span style="color:#6b7280;font-size:11px">${escapeHtml(m.mail.signatureTagline)}</span></td>` +
      `</tr></table>`,
  };
}
