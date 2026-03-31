import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const OPENAI_TRANSLATION_ROUTE = "/api/openai-translate";
const LANGUAGE_LABELS = {
  en: "English",
  ta: "Tamil",
  hi: "Hindi",
} as const;

interface TranslationRequestBody {
  text?: string;
  sourceLanguage?: keyof typeof LANGUAGE_LABELS;
  targetLanguage?: keyof typeof LANGUAGE_LABELS;
}

interface OpenAIResponsePayload {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: {
    message?: string;
  };
}

function lectureAiOpenAITranslationPlugin(): Plugin {
  const middleware = async (
    req: IncomingMessage,
    res: ServerResponse,
    next: (error?: unknown) => void,
  ) => {
    if (req.url !== OPENAI_TRANSLATION_ROUTE) {
      next();
      return;
    }

    if (req.method !== "POST") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: "Method not allowed" }));
      return;
    }

    try {
      if (!process.env.OPENAI_API_KEY) {
        res.statusCode = 503;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "OPENAI_API_KEY is not configured for the local translation route.",
          }),
        );
        return;
      }

      const body = await readJsonBody(req);
      const text = typeof body.text === "string" ? body.text.trim() : "";
      const sourceLanguage = normalizeLanguage(body.sourceLanguage);
      const targetLanguage = normalizeLanguage(body.targetLanguage);

      if (!text || !sourceLanguage || !targetLanguage) {
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "text, sourceLanguage, and targetLanguage are required." }));
        return;
      }

      if (sourceLanguage === targetLanguage) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ translatedText: text, provider: "identity" }));
        return;
      }

      const model = process.env.OPENAI_TRANSLATION_MODEL || "gpt-5-mini";
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          input: [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text:
                    "You are a lecture translation engine. Translate faithfully, preserve numbering, paragraph breaks, technical terms, and examples. Return only the translated text with no commentary.",
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text:
                    `Source language: ${LANGUAGE_LABELS[sourceLanguage]}\n` +
                    `Target language: ${LANGUAGE_LABELS[targetLanguage]}\n\n` +
                    "Translate this lecture text:\n" +
                    text,
                },
              ],
            },
          ],
        }),
      });

      const payload = (await response.json()) as OpenAIResponsePayload;
      const translatedText = extractOpenAIOutputText(payload);

      if (!response.ok) {
        res.statusCode = response.status;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error:
              payload.error?.message ||
              `OpenAI translation request failed with status ${response.status}.`,
          }),
        );
        return;
      }

      if (!translatedText) {
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: "OpenAI returned an empty translation." }));
        return;
      }

      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ translatedText, provider: "openai", model }));
    } catch (error) {
      next(error);
    }
  };

  return {
    name: "lecture-ai-openai-translation",
    configureServer(server) {
      server.middlewares.use(middleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware);
    },
  };
}

async function readJsonBody(req: IncomingMessage) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {} as TranslationRequestBody;
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf-8")) as TranslationRequestBody;
}

function normalizeLanguage(language?: string) {
  if (language === "en" || language === "ta" || language === "hi") {
    return language;
  }

  return null;
}

function extractOpenAIOutputText(payload: OpenAIResponsePayload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const textParts =
    payload.output
      ?.flatMap((item) => item.content ?? [])
      .filter((content) => content.type === "output_text" || content.type === "text")
      .map((content) => content.text?.trim())
      .filter((text): text is string => Boolean(text)) ?? [];

  return textParts.join("\n").trim();
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [lectureAiOpenAITranslationPlugin(), react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
}));
