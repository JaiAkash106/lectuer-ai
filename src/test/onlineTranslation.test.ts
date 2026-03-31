import { afterEach, describe, expect, it, vi } from "vitest";
import {
  PartialTranslationError,
  extractTranslatedText,
  resetOnlineTranslationState,
  translateTextOnline,
  translateTextsOnline,
} from "@/lib/onlineTranslation";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
  resetOnlineTranslationState();
  vi.restoreAllMocks();
});

describe("onlineTranslation", () => {
  it("prefers a translated responseData result", () => {
    const translated = extractTranslatedText(
      {
        responseData: {
          translatedText:
            "\u0B85\u0BB5\u0BB3\u0BCD \u0B95\u0B9F\u0BB1\u0BCD\u0B95\u0BB0\u0BC8\u0BAF\u0BBF\u0BB2\u0BCD \u0B95\u0B9F\u0BB2\u0BCD \u0B9A\u0BBF\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BB3\u0BC8 \u0BB5\u0BBF\u0BB1\u0BCD\u0B95\u0BBF\u0BB1\u0BBE\u0BB3\u0BCD.",
        },
      },
      "She sells seashells in the seashore.",
    );

    expect(translated).toContain("\u0B85\u0BB5\u0BB3\u0BCD");
  });

  it("falls back to the best match when responseData echoes the source text", () => {
    const translated = extractTranslatedText(
      {
        responseData: {
          translatedText: "Today we will discuss data.",
        },
        matches: [
          {
            translation:
              "\u0906\u091C \u0939\u092E \u0921\u0947\u091F\u093E \u092A\u0930 \u091A\u0930\u094D\u091A\u093E \u0915\u0930\u0947\u0902\u0917\u0947\u0964",
            quality: 90,
          },
          {
            translation:
              "\u0939\u092E \u0921\u0947\u091F\u093E \u0926\u0947\u0916\u0947\u0902\u0917\u0947\u0964",
            quality: 50,
          },
        ],
      },
      "Today we will discuss data.",
    );

    expect(translated).toBe(
      "\u0906\u091C \u0939\u092E \u0921\u0947\u091F\u093E \u092A\u0930 \u091A\u0930\u094D\u091A\u093E \u0915\u0930\u0947\u0902\u0917\u0947\u0964",
    );
  });

  it("ignores the provider query-length error text and uses a useful fallback match", () => {
    const translated = extractTranslatedText(
      {
        responseData: {
          translatedText: "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS",
        },
        matches: [
          {
            translation:
              "\u0B87\u0BA8\u0BCD\u0BA4 \u0BAA\u0B95\u0BC1\u0BA4\u0BBF AI \u0B87\u0BA9\u0BCD \u0B85\u0B9F\u0BBF\u0BAA\u0BCD\u0BAA\u0B9F\u0BC8 \u0B95\u0BB0\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BB3\u0BC8 \u0BB5\u0BBF\u0BB3\u0B95\u0BCD\u0B95\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1.",
            quality: 88,
          },
        ],
      },
      "This section explains the basic ideas behind AI.",
    );

    expect(translated).toContain("\u0B87\u0BA8\u0BCD\u0BA4");
    expect(translated).not.toContain("QUERY LENGTH LIMIT EXCEEDED");
  });

  it("returns partial batch progress when a later translation request fails", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({
          error: "OPENAI_API_KEY is not configured for the local translation route.",
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          responseData: {
            translatedText: "\u0BAE\u0BC1\u0BA4\u0BB2\u0BCD \u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BCD.",
          },
        }),
      } as Response)
      .mockRejectedValueOnce(new Error("Network unavailable"));

    let thrownError: unknown;

    try {
      await translateTextsOnline(["First sentence.", "Second sentence."], "en", "ta", {
        requestSpacingMs: 0,
      });
    } catch (error) {
      thrownError = error;
    }

    expect(thrownError).toBeInstanceOf(PartialTranslationError);
    expect((thrownError as PartialTranslationError).partialResults).toEqual([
      "\u0BAE\u0BC1\u0BA4\u0BB2\u0BCD \u0BB5\u0BBE\u0B95\u0BCD\u0B95\u0BBF\u0BAF\u0BAE\u0BCD.",
    ]);
    expect((thrownError as PartialTranslationError).completed).toBe(1);
    expect((thrownError as PartialTranslationError).total).toBe(2);
  });

  it("prefers the OpenAI translation route when it returns a translation", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({
        translatedText:
          "\u0b87\u0baf\u0bb1\u0bcd\u0b95\u0bc8 \u0bae\u0bca\u0bb4\u0bbf \u0b9a\u0bc6\u0baf\u0bb2\u0bbe\u0b95\u0bcd\u0b95\u0bae\u0bcd \u0bae\u0ba9\u0bbf\u0ba4 \u0bae\u0bca\u0bb4\u0bbf\u0baf\u0bc8 \u0baa\u0bc1\u0bb0\u0bbf\u0ba8\u0bcd\u0ba4\u0bc1\u0b95\u0bca\u0bb3\u0bcd\u0bb3 \u0b89\u0ba4\u0bb5\u0bc1\u0b95\u0bbf\u0bb1\u0ba4\u0bc1.",
      }),
    } as Response);

    const translated = await translateTextOnline(
      "Natural language processing helps computers understand human language.",
      "en",
      "ta",
    );

    expect(translated).toContain(
      "\u0b87\u0baf\u0bb1\u0bcd\u0b95\u0bc8 \u0bae\u0bca\u0bb4\u0bbf \u0b9a\u0bc6\u0baf\u0bb2\u0bbe\u0b95\u0bcd\u0b95\u0bae\u0bcd",
    );
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/openai-translate",
      expect.objectContaining({
        method: "POST",
      }),
    );
  });
});
