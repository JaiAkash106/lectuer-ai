import { describe, expect, it } from "vitest";
import {
  buildTranslatedDownloadName,
  countLectureWords,
  splitLectureFileIntoBlocks,
} from "@/lib/lectureFile";

describe("lectureFile", () => {
  it("splits long lecture text into safe translation blocks", () => {
    const text = [
      "Artificial intelligence is a field of computer science focused on creating systems that can perform tasks requiring human intelligence.",
      "Machine learning allows systems to learn from data and improve over time without being explicitly programmed.",
      "Natural language processing helps computers understand and generate human language.",
    ].join("\n\n");

    const blocks = splitLectureFileIntoBlocks(text, 140);

    expect(blocks.length).toBeGreaterThan(1);
    expect(blocks.every((block) => block.length <= 140)).toBe(true);
    expect(blocks.join(" ")).toContain("Artificial intelligence");
    expect(blocks.join(" ")).toContain("Natural language processing");
  });

  it("builds a translated download name with the target language", () => {
    expect(buildTranslatedDownloadName("lecture notes.docx", "ta")).toBe(
      "lecture_notes.ta.translated.txt",
    );
  });

  it("counts lecture words from extracted text", () => {
    expect(countLectureWords("Data science uses data and models.")).toBe(6);
  });
});
