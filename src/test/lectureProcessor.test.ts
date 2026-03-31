import { describe, expect, it } from "vitest";
import {
  buildLectureOutput,
  cleanTranscriptText,
  createEmptyLectureBuffer,
  detectLanguage,
  mergeTranscriptChunk,
  translateText,
} from "@/lib/lectureProcessor";

describe("lectureProcessor", () => {
  it("detects English, Tamil, and Hindi transcripts", () => {
    expect(detectLanguage("Neural networks learn from data.")).toBe("en");
    expect(
      detectLanguage(
        "\u0BA8\u0BB0\u0BAE\u0BCD\u0BAA\u0BBF\u0BAF\u0BB2\u0BCD \u0BB5\u0BB2\u0BC8\u0B95\u0BB3\u0BCD \u0BA4\u0BB0\u0BB5\u0BBF\u0BB2\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BC1 \u0B95\u0BB1\u0BCD\u0B95\u0BBF\u0BA9\u0BCD\u0BB1\u0BA9.",
      ),
    ).toBe("ta");
    expect(
      detectLanguage(
        "\u0928\u094D\u092F\u0942\u0930\u0932 \u0928\u0947\u091F\u0935\u0930\u094D\u0915 \u0921\u0947\u091F\u093E \u0938\u0947 \u0938\u0940\u0916\u0924\u0947 \u0939\u0948\u0902\u0964",
      ),
    ).toBe("hi");
  });

  it("merges partial chunks into a clean finalized transcript", () => {
    const first = cleanTranscriptText(
      mergeTranscriptChunk("", "today we'll explore the fundamentals"),
    );
    const second = cleanTranscriptText(
      mergeTranscriptChunk(first, "of neural networks and how they"),
    );
    const finalized = cleanTranscriptText(
      mergeTranscriptChunk(second, "learn from data."),
      true,
    );

    expect(finalized).toBe(
      "Today we'll explore the fundamentals of neural networks and how they learn from data.",
    );
  });

  it("builds the strict JSON output shape with translated summaries and keywords", () => {
    const buffer = createEmptyLectureBuffer();
    buffer.finalizedSegments = [
      "Today we'll explore the fundamentals of neural networks and how they learn from data.",
      "Neural networks consist of layers of interconnected nodes that perform simple computations.",
      "Backpropagation calculates gradients by applying the chain rule of calculus.",
      "Gradient descent helps the model minimize the loss function during training.",
    ];

    const output = buildLectureOutput(buffer, "ta");

    expect(output.detected_language).toBe("English");
    expect(output.clean_transcript).toBe(
      "Today we'll explore the fundamentals of neural networks and how they learn from data. Neural networks consist of layers of interconnected nodes that perform simple computations. Backpropagation calculates gradients by applying the chain rule of calculus. Gradient descent helps the model minimize the loss function during training.",
    );
    expect(output.translated_text).toMatch(/[\u0B80-\u0BFF]/);
    expect(output.keywords).toEqual(
      expect.arrayContaining([
        "\u0BA8\u0BB0\u0BAE\u0BCD\u0BAA\u0BBF\u0BAF\u0BB2\u0BCD \u0BB5\u0BB2\u0BC8\u0B95\u0BB3\u0BCD",
        "\u0BA4\u0BB0\u0BB5\u0BC1",
        "\u0B85\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BC1\u0B95\u0BB3\u0BCD",
        "\u0BA8\u0BCB\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",
      ]),
    );
    expect(output.short_summary).not.toHaveLength(0);
    expect(output.detailed_summary.length).toBeGreaterThanOrEqual(3);
    expect(output.detailed_summary.length).toBeLessThanOrEqual(5);
    expect(output.detailed_summary.join(" ")).toMatch(/[\u0B80-\u0BFF]/);
  });

  it("creates a compact short summary and ranked takeaways for longer lectures", () => {
    const buffer = createEmptyLectureBuffer();
    buffer.finalizedSegments = [
      "Today we'll explore the fundamentals of neural networks and how they learn from data.",
      "Neural networks consist of layers of interconnected nodes that perform simple computations.",
      "Backpropagation calculates gradients by applying the chain rule of calculus.",
      "Gradient descent helps the model minimize the loss function during training.",
      "Activation functions such as ReLU introduce non-linearity into the network.",
    ];

    const output = buildLectureOutput(buffer, "en");

    expect(output.short_summary).toMatch(/This lecture (covers|explains|summarizes)/);
    expect(output.short_summary).toMatch(/Neural Networks|Data|Layers|Gradients/);
    expect(output.short_summary.length).toBeLessThan(output.clean_transcript.length);
    expect(output.detailed_summary.length).toBeGreaterThanOrEqual(3);
    expect(output.detailed_summary.length).toBeLessThanOrEqual(5);
    expect(new Set(output.detailed_summary).size).toBe(output.detailed_summary.length);
    expect(output.detailed_summary.join(" ").toLowerCase()).toContain("neural");
  });

  it("summarizes a long lecture paragraph into distinct overview and takeaways", () => {
    const buffer = createEmptyLectureBuffer();
    buffer.finalizedSegments = [
      "Data science is an interdisciplinary field that extracts actionable patterns and predictions from raw data using scientific methods, statistics and machine learning.",
      "It is essential for informing business decisions, optimizing operations and personalizing user experiences across industries like finance, healthcare and ecommerce.",
    ];

    const output = buildLectureOutput(buffer, "en");

    expect(output.short_summary).not.toBe(output.clean_transcript);
    expect(output.short_summary).toMatch(/explains|summarizes|highlights/i);
    expect(output.detailed_summary.length).toBeGreaterThanOrEqual(3);
    expect(output.detailed_summary.join(" ")).toMatch(/uses scientific methods|applications include|industries include/i);
    expect(output.detailed_summary[0]).not.toBe(output.clean_transcript);
  });

  it("translates a generic spoken lecture intro into Tamil instead of echoing English", () => {
    const translated = translateText("Today we are going to learn about.", "en", "ta");

    expect(translated).not.toBe("Today we are going to learn about.");
    expect(translated).toMatch(/[\u0B80-\u0BFF]/);
  });

  it("translates common lecture verbs into Hindi more naturally", () => {
    const translated = translateText("Today we will discuss neural networks.", "en", "hi");

    expect(translated).not.toBe("Today we will discuss neural networks.");
    expect(translated).toContain(
      "\u0928\u094D\u092F\u0942\u0930\u0932 \u0928\u0947\u091F\u0935\u0930\u094D\u0915",
    );
    expect(translated).toMatch(
      /\u091A\u0930\u094D\u091A\u093E \u0915\u0930\u0947\u0902\u0917\u0947|\u0938\u092E\u091D\u0947\u0902\u0917\u0947|\u0926\u0947\u0916\u0947\u0902\u0917\u0947/,
    );
  });

  it("translates a common Hindi lecture opening back into English", () => {
    const source =
      "\u0906\u091C \u0939\u092E \u0921\u0947\u091F\u093E \u0915\u0947 \u092C\u093E\u0930\u0947 \u092E\u0947\u0902 \u0938\u0940\u0916\u0947\u0902\u0917\u0947\u0964";
    const translated = translateText(source, "hi", "en");

    expect(translated).not.toBe(source);
    expect(translated.toLowerCase()).toContain("data");
    expect(translated.toLowerCase()).toMatch(/learn|today|about/);
  });

  it("translates a simple spoken sentence into Tamil", () => {
    const translated = translateText("She sells seashells in the seashore.", "en", "ta");

    expect(translated).not.toBe("She sells seashells in the seashore.");
    expect(translated).toContain("\u0B85\u0BB5\u0BB3\u0BCD");
    expect(translated).toContain("\u0B95\u0B9F\u0BB2\u0BCD");
    expect(translated).toContain("\u0BB5\u0BBF\u0BB1\u0BCD\u0B95\u0BBF\u0BB1\u0BBE\u0BB3\u0BCD");
  });

  it("translates common NLP lecture terminology into Tamil for offline fallback", () => {
    const translated = translateText(
      "Natural language processing is a field of computer science and artificial intelligence.",
      "en",
      "ta",
    );

    expect(translated).toContain(
      "\u0b87\u0baf\u0bb1\u0bcd\u0b95\u0bc8 \u0bae\u0bca\u0bb4\u0bbf \u0b9a\u0bc6\u0baf\u0bb2\u0bbe\u0b95\u0bcd\u0b95\u0bae\u0bcd",
    );
    expect(translated).toContain(
      "\u0b95\u0ba3\u0bbf\u0ba9\u0bbf \u0b85\u0bb1\u0bbf\u0bb5\u0bbf\u0baf\u0bb2\u0bcd",
    );
    expect(translated).toContain(
      "\u0b9a\u0bc6\u0baf\u0bb1\u0bcd\u0b95\u0bc8 \u0ba8\u0bc1\u0ba3\u0bcd\u0ba3\u0bb1\u0bbf\u0bb5\u0bc1",
    );
  });
});
