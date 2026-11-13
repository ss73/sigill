import { describe, expect, it } from "vitest";
import { concat, keyPairFromSeed, toBase64Url, seal } from "../crypto";
import { MAX_PAYLOAD_BYTES, decodePayload, encodePayload, openMessage, sealMessage } from "./payload";

async function deflate(data: Uint8Array): Promise<Uint8Array> {
  return new Uint8Array(await new Response(new Blob([new Uint8Array(data)]).stream().pipeThrough(new CompressionStream("deflate-raw"))).arrayBuffer());
}

describe("payload", () => {
  it("round-trips text and compresses repetitive content", async () => {
    const text = "Hej Åsa! 🔐 ".repeat(200);
    const encoded = await encodePayload({ text });
    expect(encoded[0]).toBe(1);
    expect(encoded.length).toBeLessThan(text.length / 5);
    expect(await decodePayload(encoded)).toEqual({ text });
  });

  it("rejects unknown formats and damaged content", async () => {
    await expect(decodePayload(Uint8Array.of(9, 1, 2))).rejects.toThrow(/format/);
    await expect(decodePayload(Uint8Array.of(1, 0xff, 0xff, 0xff))).rejects.toThrow(/damaged/);
    const notText = concat(Uint8Array.of(1), await deflate(new TextEncoder().encode('{"t":5}')));
    await expect(decodePayload(notText)).rejects.toThrow(/damaged/);
  });

  it("refuses decompression bombs", async () => {
    const huge = new TextEncoder().encode(JSON.stringify({ t: "a".repeat(MAX_PAYLOAD_BYTES + 10) }));
    const bomb = concat(Uint8Array.of(1), await deflate(huge));
    expect(bomb.length).toBeLessThan(5000);
    await expect(decodePayload(bomb)).rejects.toThrow(/too large/);
  });

  it("seals and opens a message end to end", async () => {
    const inbox = await keyPairFromSeed(crypto.getRandomValues(new Uint8Array(32)));
    const envelope = await sealMessage(inbox.publicKey, { text: "Top secret" });
    expect(envelope).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(await openMessage(inbox, envelope)).toEqual({ text: "Top secret" });
  });

  it("rejects envelopes whose plaintext is not a payload", async () => {
    const inbox = await keyPairFromSeed(crypto.getRandomValues(new Uint8Array(32)));
    const raw = toBase64Url(await seal(inbox.publicKey, new TextEncoder().encode("plain")));
    await expect(openMessage(inbox, raw)).rejects.toThrow(/format/);
  });
});
