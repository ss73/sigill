/**
 * The WebAuthn relying party ID: the domain every inbox passkey is bound to.
 * Production builds must set VITE_RP_ID (e.g. "safe.example.com") so that a
 * copy of the site served from another hostname refuses to create passkeys
 * there instead of silently splitting users across domains.
 */
const configured: string | undefined = import.meta.env.VITE_RP_ID;

export const RP_ID: string = configured ?? location.hostname;

/** Returns a problem description if this page must not use passkeys, else null. */
export function rpIdProblem(): string | null {
  if (import.meta.env.PROD && !configured) {
    return "This build has no VITE_RP_ID configured.";
  }
  const host = location.hostname;
  if (host !== RP_ID && !host.endsWith(`.${RP_ID}`)) {
    return `This page is served from ${host}, but inbox passkeys belong to ${RP_ID}.`;
  }
  return null;
}
