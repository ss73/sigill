/**
 * A small picture of a security code: a mirrored 5×5 pattern in one of
 * eight colours, drawn from the code's own bits. It helps recognise someone
 * at a glance ("that's not what Bob usually looks like"), but carries far
 * fewer bits than the code, so the code is still what proves a link.
 */

import { fromHex } from "../crypto";

const COLOURS = 8;

export interface KeyPattern {
  /** 0–7, a --pic-N colour token. */
  colour: number;
  /** 5 rows × 5 columns, mirrored left to right. */
  cells: boolean[][];
}

/** The pattern for a security code like "1056-8b24-6f28-fd4f". */
export function keyPattern(code: string): KeyPattern {
  const bytes = fromHex(code.replace(/-/g, ""));
  const bit = (i: number): boolean => ((bytes[i >> 3]! >> (i & 7)) & 1) === 1;
  const cells = Array.from({ length: 5 }, (_, y) =>
    Array.from({ length: 5 }, (_, x) => bit(y * 3 + Math.min(x, 4 - x))),
  );
  return { colour: bytes[7]! % COLOURS, cells };
}

const NS = "http://www.w3.org/2000/svg";

export function keyPicture(code: string, size = 32): SVGSVGElement {
  const { colour, cells } = keyPattern(code);
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", "0 0 50 50");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("class", "key-picture");
  svg.setAttribute("aria-hidden", "true"); // the code beside it says the same, exactly
  svg.style.setProperty("--pic", `var(--pic-${colour})`);
  const rect = (attrs: Record<string, number | string>): void => {
    const el = document.createElementNS(NS, "rect");
    for (const [name, value] of Object.entries(attrs)) {
      el.setAttribute(name, String(value));
    }
    svg.append(el);
  };
  rect({ class: "bg", width: 50, height: 50, rx: 6 });
  cells.forEach((row, y) =>
    row.forEach((on, x) => {
      if (on) {
        rect({ x: 5 + x * 8, y: 5 + y * 8, width: 8, height: 8 });
      }
    }),
  );
  return svg;
}
