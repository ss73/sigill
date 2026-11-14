import { describe, expect, it } from "vitest";
import { en } from "./en";
import { LANGUAGES, detectLang, messagesFor } from ".";

const SAMPLE = "someone@example.com";

type Tree = { [key: string]: string | ((...args: string[]) => string) | Tree };

/** Every leaf as [path, value]. */
function leaves(tree: Tree, prefix = ""): [string, Tree[string]][] {
  return Object.entries(tree).flatMap(([key, value]) =>
    typeof value === "object" ? leaves(value, `${prefix}${key}.`) : [[`${prefix}${key}`, value] as [string, Tree[string]]],
  );
}

describe("detectLang", () => {
  it("picks the first supported browser language", () => {
    expect(detectLang(["sv-SE", "en-US"])).toBe("sv");
    expect(detectLang(["ja", "pt-BR"])).toBe("pt");
    expect(detectLang(["nb-NO"])).toBe("no");
    expect(detectLang(["nn"])).toBe("no");
    expect(detectLang(["ja"])).toBe("en");
    expect(detectLang([])).toBe("en");
  });
});

describe.each(LANGUAGES.map((l) => l.code))("%s", (code) => {
  it("has every text, non-empty, with its parameters filled in", async () => {
    const messages = (await messagesFor(code)) as unknown as Tree;
    const expected = leaves(en as unknown as Tree);
    const actual = new Map(leaves(messages));
    expect([...actual.keys()].sort()).toEqual(expected.map(([path]) => path).sort());

    for (const [path, source] of expected) {
      const value = actual.get(path)!;
      expect(typeof value, path).toBe(typeof source);
      if (typeof value === "string") {
        expect(value.trim(), path).not.toBe("");
        // Texts are joined with other parts, so spaces at the joins must stay.
        // (A language may add one, e.g. German " ein." after a link.)
        if (/^\s/.test(source as string)) {
          expect(value, `${path} leading space`).toMatch(/^\s/);
        }
        if (/\s$/.test(source as string)) {
          expect(value, `${path} trailing space`).toMatch(/\s$/);
        }
      } else if (typeof value === "function") {
        const withArg = value(SAMPLE);
        expect(withArg, path).toContain(SAMPLE);
        // Optional parameters (an unknown e-mail) must read well without them.
        if (!(source as () => string)().includes("undefined")) {
          const without = value();
          expect(without.trim(), path).not.toBe("");
          expect(without, path).not.toContain("undefined");
        }
      }
    }
  });
});
