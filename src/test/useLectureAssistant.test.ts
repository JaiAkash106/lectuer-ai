import { describe, expect, it } from "vitest";
import { splitPastedTranscript } from "@/hooks/useLectureAssistant";

describe("useLectureAssistant helpers", () => {
  it("splits long pasted lecture text into safe final chunks", () => {
    const text =
      "Artificial intelligence, commonly known as AI, is a field of computer science that focuses on creating machines capable of performing tasks that typically require human intelligence. These tasks include learning, reasoning, problem-solving, perception, and language understanding. Machine learning is a subset of AI that allows systems to learn from data and improve their performance without being explicitly programmed.";

    const chunks = splitPastedTranscript(text, 180);

    expect(chunks.length).toBeGreaterThan(1);
    expect(chunks.every((chunk) => chunk.length <= 180)).toBe(true);
    expect(chunks.join(" ")).toContain("Artificial intelligence");
    expect(chunks.join(" ")).toContain("Machine learning");
  });
});
