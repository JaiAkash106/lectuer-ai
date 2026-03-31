import type { SupportedLanguageCode } from "@/lib/lectureProcessor";

const SUPPORTED_TEXT_TYPES = new Set([
  "text/plain",
  "text/markdown",
  "application/json",
]);

export interface ExtractedLectureFile {
  text: string;
  fileTypeLabel: string;
}

export async function extractTextFromLectureFile(file: File): Promise<ExtractedLectureFile> {
  const lowerName = file.name.toLowerCase();

  if (SUPPORTED_TEXT_TYPES.has(file.type) || /\.(txt|md|json)$/i.test(lowerName)) {
    return {
      text: normalizeLectureFileText(await file.text()),
      fileTypeLabel: "Text",
    };
  }

  if (
    /\.docx$/i.test(lowerName) ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    return {
      text: normalizeLectureFileText(result.value),
      fileTypeLabel: "DOCX",
    };
  }

  if (/\.pdf$/i.test(lowerName) || file.type === "application/pdf") {
    const [{ GlobalWorkerOptions, getDocument }, pdfWorker] = await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
    ]);
    const arrayBuffer = await file.arrayBuffer();

    GlobalWorkerOptions.workerSrc = pdfWorker.default;
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    const pages: string[] = [];

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (pageText) {
        pages.push(pageText);
      }
    }

    return {
      text: normalizeLectureFileText(pages.join("\n\n")),
      fileTypeLabel: "PDF",
    };
  }

  throw new Error("Unsupported file type. Please upload a TXT, PDF, or DOCX lecture file.");
}

export function splitLectureFileIntoBlocks(text: string, maxChars = 900) {
  const normalized = normalizeLectureFileText(text);

  if (!normalized) {
    return [];
  }

  const paragraphs = normalized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const blocks: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxChars) {
      blocks.push(paragraph);
      continue;
    }

    const sentences =
      paragraph.match(/[^.?!\u0964]+[.?!\u0964]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ??
      [paragraph];

    let currentBlock = "";

    for (const sentence of sentences) {
      if (sentence.length > maxChars) {
        if (currentBlock) {
          blocks.push(currentBlock);
          currentBlock = "";
        }

        blocks.push(...splitLongTextByWords(sentence, maxChars));
        continue;
      }

      const candidate = currentBlock ? `${currentBlock} ${sentence}` : sentence;

      if (candidate.length <= maxChars) {
        currentBlock = candidate;
        continue;
      }

      if (currentBlock) {
        blocks.push(currentBlock);
      }

      currentBlock = sentence;
    }

    if (currentBlock) {
      blocks.push(currentBlock);
    }
  }

  return blocks;
}

export function buildTranslatedDownloadName(fileName: string, targetLanguage: SupportedLanguageCode) {
  const sanitizedBaseName = fileName.replace(/\.[^.]+$/, "").replace(/[^\w.-]+/g, "_");
  return `${sanitizedBaseName}.${targetLanguage}.translated.txt`;
}

export function countLectureWords(text: string) {
  return text.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;
}

function normalizeLectureFileText(text: string) {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function splitLongTextByWords(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const blocks: string[] = [];
  let currentBlock = "";

  for (const word of words) {
    if (word.length > maxChars) {
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = "";
      }

      for (let index = 0; index < word.length; index += maxChars) {
        blocks.push(word.slice(index, index + maxChars));
      }

      continue;
    }

    const candidate = currentBlock ? `${currentBlock} ${word}` : word;

    if (candidate.length <= maxChars) {
      currentBlock = candidate;
      continue;
    }

    if (currentBlock) {
      blocks.push(currentBlock);
    }

    currentBlock = word;
  }

  if (currentBlock) {
    blocks.push(currentBlock);
  }

  return blocks;
}
