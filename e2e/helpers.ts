import type { Page } from "@playwright/test";

/** Attaches a Chrome virtual authenticator that auto-approves passkey prompts. */
export async function addAuthenticator(page: Page, hasPrf = true): Promise<void> {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("WebAuthn.enable");
  await cdp.send("WebAuthn.addVirtualAuthenticator", {
    options: {
      protocol: "ctap2",
      transport: "internal",
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
      hasPrf,
    },
  });
}

/** Parses a mailto: href into its parts. */
export function parseMailto(href: string): { to: string; subject: string; body: string } {
  const url = new URL(href);
  return {
    to: decodeURIComponent(url.pathname),
    subject: url.searchParams.get("subject") ?? "",
    body: url.searchParams.get("body") ?? "",
  };
}

export function firstLink(text: string): string {
  const match = /https?:\/\/\S+/.exec(text);
  if (!match) {
    throw new Error(`No link in: ${text}`);
  }
  return match[0];
}
