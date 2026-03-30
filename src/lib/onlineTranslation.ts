import { type SupportedLanguageCode } from "@/lib/lectureProcessor";

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
    match?: number;
  };
  responseStatus?: number;
  matches?: Array<{
    translation?: string;
    quality?: string | number;
  }>;
}

const translationCache = new Map<string, string>();
const MAX_PROVIDER_QUERY_CHARS = 450;
const REQUEST_SPACING_MS = 250;
const MAX_RETRY_ATTEMPTS = 3;

interface TranslateTextsOptions {
  onProgress?: (completed: number, total: number) => void;
  onPartialResult?: (translatedText: string, completed: number, total: number) => void;
  requestSpacingMs?: number;
}

export async function translateTextsOnline(
  texts: string[],
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
  options: TranslateTextsOptions = {},
) {
  const results: string[] = [];
  const spacingMs = options.requestSpacingMs ?? REQUEST_SPACING_MS;

  for (let index = 0; index < texts.length; index += 1) {
    const text = texts[index];
    const translatedText = await translateTextOnline(text, sourceLanguage, targetLanguage);
    results.push(translatedText);
    options.onProgress?.(index + 1, texts.length);
    options.onPartialResult?.(translatedText, index + 1, texts.length);

    if (index < texts.length - 1) {
      await sleep(spacingMs);
    }
  }

  return results;
}

export async function translateTextOnline(
  text: string,
  sourceLanguage: SupportedLanguageCode,
  targetLanguage: SupportedLanguageCode,
) {
  const normalized = text.trim();

  if (!normalized || sourceLanguage === targetLanguage) {
    return normalized;
  }

  const cacheKey = `${sourceLanguage}:${targetLanguage}:${normalized}`;
  const cached = translationCache.get(cacheKey);

  if (cached) {
    return cached;
  }

  if (normalized.length > MAX_PROVIDER_QUERY_CHARS) {
    const translatedParts: string[] = [];

    for (const part of splitTextForTranslation(normalized, MAX_PROVIDER_QUERY_CHARS)) {
      translatedParts.push(
        await translateTextOnline(part, sourceLanguage, targetLanguage),
      );
    }

    const combined = cleanupCombinedTranslation(translatedParts.join(" "));
    translationCache.set(cacheKey, combined);
    return combined;
  }

  const url =
    "https://api.mymemory.translated.net/get" +
    `?q=${encodeURIComponent(normalized)}` +
    `&langpair=${encodeURIComponent(`${sourceLanguage}|${targetLanguage}`)}` +
    "&mt=1";

  for (let attempt = 0; attempt < MAX_RETRY_ATTEMPTS; attempt += 1) {
    const response = await fetch(url);

    if (response.ok) {
      const data = (await response.json()) as MyMemoryResponse;
      const translated = extractTranslatedText(data, normalized);

      if (!translated) {
        throw new Error("Translation provider returned an empty result");
      }

      translationCache.set(cacheKey, translated);
      return translated;
    }

    if (response.status === 429 && attempt < MAX_RETRY_ATTEMPTS - 1) {
      await sleep(700 * (attempt + 1));
      continue;
    }

    if (response.status >= 500 && response.status < 600 && attempt < MAX_RETRY_ATTEMPTS - 1) {
      await sleep(500 * (attempt + 1));
      continue;
    }

    if (response.status === 429) {
      throw new Error("Online translation is temporarily rate limited. Please retry in a moment.");
    }

    throw new Error(`Translation request failed with status ${response.status}`);
  }

  throw new Error("Translation request failed after multiple retries.");
}

export function extractTranslatedText(data: MyMemoryResponse, originalText: string) {
  const responseTranslation = sanitizeProviderText(data.responseData?.translatedText);

  if (isUsefulTranslation(responseTranslation, originalText)) {
    return responseTranslation;
  }

  const bestMatch = [...(data.matches ?? [])]
    .map((match) => ({
      text: sanitizeProviderText(match.translation),
      quality: Number(match.quality ?? 0),
    }))
    .filter((match) => isUsefulTranslation(match.text, originalText))
    .sort((left, right) => right.quality - left.quality)[0];

  return bestMatch?.text ?? "";
}

function sanitizeProviderText(text?: string) {
  if (!text) {
    return "";
  }

  return text
    .replace(/\s+/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function isUsefulTranslation(translatedText: string, originalText: string) {
  if (!translatedText) {
    return false;
  }

  const normalizedTranslated = translatedText.trim().toLowerCase();
  const normalizedOriginal = originalText.trim().toLowerCase();

  if (!normalizedTranslated) {
    return false;
  }

  if (normalizedTranslated === normalizedOriginal) {
    return false;
  }

  if (normalizedTranslated.includes("please select two distinct languages")) {
    return false;
  }

  if (normalizedTranslated.includes("query length limit exceeded")) {
    return false;
  }

  return true;
}

function splitTextForTranslation(text: string, maxChars: number) {
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  const sentenceParts = normalized.match(/[^.?!\u0964]+[.?!\u0964]?/g)?.map((part) => part.trim()).filter(Boolean);

  if (!sentenceParts || sentenceParts.length === 0) {
    return splitByWords(normalized, maxChars);
  }

  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentenceParts) {
    if (sentence.length > maxChars) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }

      chunks.push(...splitByWords(sentence, maxChars));
      continue;
    }

    const candidate = currentChunk ? `${currentChunk} ${sentence}` : sentence;

    if (candidate.length <= maxChars) {
      currentChunk = candidate;
      continue;
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    currentChunk = sentence;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function splitByWords(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if (word.length > maxChars) {
      if (currentChunk) {
        chunks.push(currentChunk);
        currentChunk = "";
      }

      for (let index = 0; index < word.length; index += maxChars) {
        chunks.push(word.slice(index, index + maxChars));
      }

      continue;
    }

    const candidate = currentChunk ? `${currentChunk} ${word}` : word;

    if (candidate.length <= maxChars) {
      currentChunk = candidate;
      continue;
    }

    if (currentChunk) {
      chunks.push(currentChunk);
    }

    currentChunk = word;
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

function cleanupCombinedTranslation(text: string) {
  return text
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;!?\u0964])/g, "$1")
    .trim();
}

function sleep(milliseconds: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
