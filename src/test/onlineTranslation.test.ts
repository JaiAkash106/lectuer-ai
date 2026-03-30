import { describe, expect, it } from "vitest";
import { extractTranslatedText } from "@/lib/onlineTranslation";

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
});
