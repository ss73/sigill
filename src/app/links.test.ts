import { describe, expect, it } from "vitest";
import { fromBase64Url, toBase64Url } from "../crypto";
import { fragmentFromPaste, inboxLink, inviteLink, messageLink, parseRoute } from "./links";

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
    expect(parseRoute(new URL(messageLink(BASE, "abc_-")).hash)).toEqual({ name: "open", envelope: "abc_-" });
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

  it("extracts fragments from pasted links", () => {
    const link = inboxLink(BASE, KEY);
    expect(fragmentFromPaste(`  ${link}\n`)).toBe(new URL(link).hash);
    expect(fragmentFromPaste("https://example.com/")).toBeNull();
    expect(fragmentFromPaste("https://example.com/#nothing")).toBeNull();
    expect(fromBase64Url(fragmentFromPaste(link)!.slice(4)).length).toBe(32);
  });
});
