/**
 * E-mail templates and mailto: links.
 *
 * Long mailto: URLs are silently truncated or refused by some mail programs
 * (Outlook on Windows around 2000 characters), so callers check fitsMailto()
 * and fall back to copy & paste for long messages.
 */

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

export function messageEmail(link: string): Email {
  return {
    subject: "A secure message for you",
    body:
      "Hi,\n\n" +
      "I've sent you a secure message. Click the link to open it with your passkey:\n\n" +
      `${link}\n\n` +
      "Only you can read it: it is encrypted, and the key never leaves your password manager.",
  };
}

export function inviteEmail(link: string): Email {
  return {
    subject: "Can I send you something securely?",
    body:
      "Hi,\n\n" +
      "I'd like to send you something confidential. Please create a free secure inbox. " +
      "It takes half a minute, needs no account, and only you will be able to read what I send:\n\n" +
      `${link}\n\n` +
      "When you're done, send me your secure link.\n\n" +
      "Thanks!",
  };
}

export function inboxLinkEmail(link: string): Email {
  return {
    subject: "My secure link",
    body:
      "Hi,\n\n" +
      "Here is my secure link. Use it to send me confidential messages that only I can read:\n\n" +
      `${link}\n\n` +
      "Thanks!",
  };
}

/** The whole e-mail as plain text, for copying into webmail. */
export function asText(email: Email): string {
  return `${email.subject}\n\n${email.body}`;
}
