import { describe, expect, it } from "vitest";
import { fromBase64Url, toBase64Url } from "../crypto";
import {
  cleanEmail,
  fragmentFromPaste,
  inboxLink,
  inviteLink,
  isMessageFragment,
  langHint,
  linkCheck,
  linkIntact,
  messageLink,
  parseRoute,
} from "./links";

const BASE = "https://example.com/app/";
const KEY = new Uint8Array(32).fill(7);

describe("links", () => {
  it("round-trips an inbox link with e-mail", () => {
    const link = inboxLink(BASE, KEY, "a+b@example.com");
    expect(link.startsWith(`${BASE}#to=`)).toBe(true);
    const route = parseRoute(new URL(link).hash);
    expect(route).toEqual({ name: "compose", to: KEY, email: "a+b@example.com" });
  });

  it("omits an absent e-mail and ignores invalid ones", () => {
    expect(inboxLink(BASE, KEY)).not.toContain("&e=");
    const route = parseRoute(`#to=${toBase64Url(KEY)}&e=not-an-email`);
    expect(route).toEqual({ name: "compose", to: KEY, email: undefined });
  });

  it("flags broken inbox links", () => {
    expect(parseRoute(`#to=${toBase64Url(KEY).slice(0, 20)}`).name).toBe("broken-link");
    expect(parseRoute("#to=!!!").name).toBe("broken-link");
  });

  it("parses message, invite and plain routes", () => {
    expect(parseRoute(new URL(messageLink(BASE, "abc_-")).hash)).toEqual({ name: "open", envelope: "abc_-", check: linkCheck("abc_-") });
    expect(parseRoute(new URL(inviteLink(BASE, { reply: "me@x.io", email: "you@y.io" })).hash)).toEqual({
      name: "inbox",
      reply: "me@x.io",
      email: "you@y.io",
    });
    expect(inviteLink(BASE, {})).toBe(`${BASE}#inbox`);
    expect(parseRoute("#send")).toEqual({ name: "send" });
    expect(parseRoute("#open")).toEqual({ name: "open" });
    expect(parseRoute("")).toEqual({ name: "home" });
    expect(parseRoute("#whatever")).toEqual({ name: "home" });
  });

  it("carries the e-mail language as a hint", () => {
    const message = new URL(messageLink(BASE, "abc_-", "sv")).hash;
    expect(message).toBe(`#c=${linkCheck("abc_-")}&m=abc_-&l=sv`);
    expect(parseRoute(message)).toEqual({ name: "open", envelope: "abc_-", check: linkCheck("abc_-") });
    expect(langHint(message)).toBe("sv");
    expect(langHint(new URL(inviteLink(BASE, { lang: "de" })).hash)).toBe("de");
    expect(langHint("#m=abc")).toBeNull();
  });

  it("puts a check value first in message links, so a cut-off link is caught", () => {
    expect(linkCheck("123456789")).toBe("y_Q5Jg"); // CRC-32 0xcbf43926
    const envelope = "AQ" + "x".repeat(200);
    const hash = new URL(messageLink(BASE, envelope)).hash;
    const whole = parseRoute(hash);
    expect(whole.name === "open" && linkIntact(whole.envelope!, whole.check)).toBe(true);
    const cut = parseRoute(hash.slice(0, -10));
    expect(cut.name === "open" && linkIntact(cut.envelope!, cut.check)).toBe(false);
    const changed = parseRoute(hash.replace("xxx", "xyx"));
    expect(changed.name === "open" && linkIntact(changed.envelope!, changed.check)).toBe(false);
  });

  it("still opens message links made before the check value", () => {
    const route = parseRoute("#m=abc_-&l=sv");
    expect(route).toEqual({ name: "open", envelope: "abc_-" });
    expect(linkIntact("abc_-", undefined)).toBeUndefined();
    expect(isMessageFragment("#m=abc_-")).toBe(true);
    expect(isMessageFragment(`#c=${linkCheck("abc")}&m=abc`)).toBe(true);
    expect(isMessageFragment("#open")).toBe(false);
  });

  it("extracts fragments from pasted links", () => {
    const link = inboxLink(BASE, KEY);
    expect(fragmentFromPaste(`  ${link}\n`)).toBe(new URL(link).hash);
    expect(fragmentFromPaste("https://example.com/")).toBeNull();
    expect(fragmentFromPaste("https://example.com/#nothing")).toBeNull();
    expect(fromBase64Url(fragmentFromPaste(link)!.slice(4)).length).toBe(32);
  });
});

describe("cleanEmail", () => {
  it("accepts ordinary addresses, trimmed", () => {
    expect(cleanEmail("  anna.berg+news@example.co.uk ")).toBe("anna.berg+news@example.co.uk");
    expect(cleanEmail("Anna@Example.COM")).toBe("Anna@example.com");
    expect(cleanEmail("åsa@example.se")).toBe("åsa@example.se");
  });

  it("rejects what isn't an address", () => {
    for (const value of ["", "anna", "anna@example", "a b@example.com", "<a>@example.com", "a@exa mple.com", "a@ex%41mple.com"]) {
      expect(cleanEmail(value), value).toBeUndefined();
    }
  });

  it("rejects invisible and direction-changing characters", () => {
    for (const value of [
      "ceo\u200b@example.com", // zero-width space
      "ceo@exam\u00adple.com", // soft hyphen
      "ceo@\u202emoc.elpmaxe", // right-to-left override
      "ceo\u2066@example.com", // bidi isolate
      "ceo\u00a0x@example.com", // no-break space
      "ceo\u0007@example.com", // control character
    ]) {
      expect(cleanEmail(value), JSON.stringify(value)).toBeUndefined();
    }
  });

  it("exposes non-Latin domains, so lookalikes are visible", () => {
    expect(cleanEmail("ceo@ex\u0430mple.com")).toBe("ceo@xn--exmple-4nf.com"); // Cyrillic а
    expect(cleanEmail("info@räksmörgås.se")).toBe("info@xn--rksmrgs-5wao1o.se");
  });
});
