/**
 * What goes inside an envelope.
 *
 * Payload layout: format (1) | deflate-raw(JSON)
 *
 * Compression roughly halves typical text, which matters because the whole
 * message has to fit in a link. The JSON object leaves room for later
 * fields (attachments, a reply address) without a new envelope version.
 */

import { KEY_LENGTH, concat, fromBase64Url, open, seal, toBase64Url, utf8Decode, utf8Encode, type Bytes, type InboxKeyPair } from "../crypto";
import { cleanEmail } from "./links";

const FORMAT_DEFLATE_JSON = 1;

/** Upper bound on decompressed size, so a crafted message cannot exhaust memory. */
export const MAX_PAYLOAD_BYTES = 1_000_000;

/** Where a secure reply should go: the sender's own inbox. */
export interface ReplyTo {
  key: Bytes;
  email?: string;
}

export interface Payload {
  text: string;
  /** The sender's inbox, if they want an encrypted reply. */
  replyTo?: ReplyTo;
  /** The recipient's e-mail as the sender knew it; lets replies carry it back. */
  to?: string;
}

interface Wire {
  t: string;
  r?: { k: string; e?: string };
  to?: string;
}

async function pipe(data: Bytes, transform: CompressionStream | DecompressionStream, limit: number): Promise<Bytes> {
  const reader = new Blob([data]).stream().pipeThrough(transform).getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    total += value.length;
    if (total > limit) {
      await reader.cancel();
      throw new Error("Message is too large");
    }
    chunks.push(value);
  }
  return concat(...chunks);
}

export async function encodePayload(payload: Payload): Promise<Bytes> {
  const wire: Wire = { t: payload.text };
  if (payload.replyTo) {
    wire.r = { k: toBase64Url(payload.replyTo.key), e: payload.replyTo.email };
  }
  if (payload.to) {
    wire.to = payload.to;
  }
  const json = utf8Encode(JSON.stringify(wire));
  const compressed = await pipe(json, new CompressionStream("deflate-raw"), Infinity);
  return concat(Uint8Array.of(FORMAT_DEFLATE_JSON), compressed);
}

export async function decodePayload(bytes: Bytes): Promise<Payload> {
  if (bytes[0] !== FORMAT_DEFLATE_JSON) {
    throw new Error("Unsupported message format");
  }
  let parsed: unknown;
  try {
    const json = await pipe(bytes.slice(1), new DecompressionStream("deflate-raw"), MAX_PAYLOAD_BYTES);
    parsed = JSON.parse(utf8Decode(json));
  } catch (error) {
    if (error instanceof Error && error.message === "Message is too large") {
      throw error;
    }
    throw new Error("Message content is damaged");
  }
  if (typeof parsed !== "object" || parsed === null || typeof (parsed as { t?: unknown }).t !== "string") {
    throw new Error("Message content is damaged");
  }
  const wire = parsed as Partial<Record<keyof Wire, unknown>> & { t: string };
  return { text: wire.t, replyTo: parseReplyTo(wire.r), to: optionalEmail(wire.to) };
}

function optionalEmail(value: unknown): string | undefined {
  return typeof value === "string" ? cleanEmail(value) : undefined;
}

/** Optional fields are dropped rather than failing the whole message if malformed. */
function parseReplyTo(value: unknown): ReplyTo | undefined {
  if (typeof value !== "object" || value === null) {
    return undefined;
  }
  const { k, e } = value as { k?: unknown; e?: unknown };
  try {
    const key = typeof k === "string" ? fromBase64Url(k) : null;
    return key?.length === KEY_LENGTH ? { key, email: optionalEmail(e) } : undefined;
  } catch {
    return undefined;
  }
}

/** Encrypts a payload to an inbox; returns the base64url envelope for a link. */
export async function sealMessage(recipient: Uint8Array, payload: Payload): Promise<string> {
  return toBase64Url(await seal(recipient, await encodePayload(payload)));
}

export async function openMessage(inbox: InboxKeyPair, envelope: string): Promise<Payload> {
  return decodePayload(await open(inbox, fromBase64Url(envelope)));
}
