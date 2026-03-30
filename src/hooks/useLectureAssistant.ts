import { useCallback, useEffect, useRef, useState } from "react";
import {
  buildLectureOutput,
  cleanTranscriptText,
  createEmptyLectureBuffer,
  createEmptyLectureOutput,
  detectLanguage,
  mergeTranscriptChunk,
  type LectureEngineOutput,
  type LectureProcessingBuffer,
  type SupportedLanguageCode,
} from "@/lib/lectureProcessor";
import { translateTextOnline, translateTextsOnline } from "@/lib/onlineTranslation";

export interface TranscriptEntry {
  id: string;
  text: string;
  timestamp: Date;
  isFinal: boolean;
}

export interface LectureState {
  isRecording: boolean;
  transcripts: TranscriptEntry[];
  currentPartial: string;
  translatedText: string;
  targetLanguage: SupportedLanguageCode;
  inputLanguage: SupportedLanguageCode;
  keywords: string[];
  shortSummary: string;
  detailedSummary: string[];
  detectedLanguage: string;
  duration: number;
  statusMessage: string;
  speechRecognitionSupported: boolean;
  engineOutput: LectureEngineOutput;
}

const INPUT_LANGUAGE_LOCALES: Record<SupportedLanguageCode, string> = {
  en: "en-IN",
  ta: "ta-IN",
  hi: "hi-IN",
};

const MANUAL_CHUNK_MAX_CHARS = 280;

const SPEECH_ERROR_MESSAGES: Record<string, string> = {
  "audio-capture": "No microphone was found. Check your audio input and browser permissions.",
  "language-not-supported": "This browser does not support the selected speech recognition language.",
  "network": "Speech recognition hit a network issue. Try again in a moment.",
  "not-allowed": "Microphone access was blocked. Allow microphone permission in the browser and retry.",
  "no-speech": "No speech was detected. Keep speaking or restart the microphone.",
  "service-not-allowed": "Speech recognition is disabled in this browser session.",
};

export function useLectureAssistant() {
  const speechRecognitionSupported =
    typeof window !== "undefined" &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

  const [state, setState] = useState<LectureState>({
    isRecording: false,
    transcripts: [],
    currentPartial: "",
    translatedText: "",
    targetLanguage: "ta",
    inputLanguage: "en",
    keywords: [],
    shortSummary: "",
    detailedSummary: [],
    detectedLanguage: "",
    duration: 0,
    statusMessage: speechRecognitionSupported
      ? "Choose an input language and start the microphone."
      : "Speech recognition is not available in this browser. Use manual chunk input instead.",
    speechRecognitionSupported,
    engineOutput: createEmptyLectureOutput(),
  });

  const bufferRef = useRef<LectureProcessingBuffer>(createEmptyLectureBuffer());
  const transcriptRef = useRef<TranscriptEntry[]>([]);
  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const shouldKeepListeningRef = useRef(false);
  const targetLanguageRef = useRef<SupportedLanguageCode>("ta");
  const inputLanguageRef = useRef<SupportedLanguageCode>("en");
  const translationRequestRef = useRef(0);

  const clearDurationTimer = useCallback(() => {
    if (durationRef.current) {
      clearInterval(durationRef.current);
      durationRef.current = null;
    }
  }, []);

  const syncDerivedState = useCallback(
    (overrides?: Partial<Pick<LectureState, "isRecording" | "statusMessage" | "duration">>) => {
      const output = buildLectureOutput(bufferRef.current, targetLanguageRef.current);

      setState((prev) => ({
        ...prev,
        isRecording: overrides?.isRecording ?? prev.isRecording,
        statusMessage: overrides?.statusMessage ?? prev.statusMessage,
        duration: overrides?.duration ?? prev.duration,
        transcripts: [...transcriptRef.current],
        currentPartial: bufferRef.current.activeSegment,
        translatedText: output.translated_text,
        keywords: output.keywords,
        shortSummary: output.short_summary,
        detailedSummary: output.detailed_summary,
        detectedLanguage: output.detected_language,
        engineOutput: output,
      }));
    },
    [],
  );

  const commitFinalChunk = useCallback(
    (chunk: string) => {
      const cleaned = cleanTranscriptText(chunk, true);

      if (!cleaned) {
        return;
      }

      bufferRef.current = {
        finalizedSegments: [...bufferRef.current.finalizedSegments, cleaned],
        activeSegment: "",
      };

      transcriptRef.current = [
        ...transcriptRef.current,
        {
          id: crypto.randomUUID(),
          text: cleaned,
          timestamp: new Date(),
          isFinal: true,
        },
      ];

      syncDerivedState({
        isRecording: shouldKeepListeningRef.current,
        statusMessage: shouldKeepListeningRef.current
          ? "Listening to the microphone..."
          : "Transcript updated.",
      });
    },
    [syncDerivedState],
  );

  const appendTranscriptChunk = useCallback(
    (chunk: string, isFinal: boolean) => {
      const merged = mergeTranscriptChunk(bufferRef.current.activeSegment, chunk);

      if (isFinal) {
        commitFinalChunk(merged);
        return;
      }

      bufferRef.current = {
        ...bufferRef.current,
        activeSegment: cleanTranscriptText(merged),
      };

      syncDerivedState({
        isRecording: shouldKeepListeningRef.current,
        statusMessage: shouldKeepListeningRef.current
          ? "Listening to the microphone..."
          : "Partial transcript updated.",
      });
    },
    [commitFinalChunk, syncDerivedState],
  );

  const replacePartialChunk = useCallback(
    (chunk: string) => {
      bufferRef.current = {
        ...bufferRef.current,
        activeSegment: cleanTranscriptText(chunk),
      };

      syncDerivedState({
        isRecording: shouldKeepListeningRef.current,
        statusMessage: "Listening to the microphone...",
      });
    },
    [syncDerivedState],
  );

  const resetSession = useCallback(() => {
    shouldKeepListeningRef.current = false;

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    clearDurationTimer();
    bufferRef.current = createEmptyLectureBuffer();
    transcriptRef.current = [];

    setState((prev) => ({
      ...prev,
      isRecording: false,
      transcripts: [],
      currentPartial: "",
      translatedText: "",
      keywords: [],
      shortSummary: "",
      detailedSummary: [],
      detectedLanguage: "",
      duration: 0,
      statusMessage: prev.speechRecognitionSupported
        ? "Session cleared. Start the microphone or use manual chunk input."
        : "Session cleared. Use manual chunk input because speech recognition is unavailable here.",
      engineOutput: createEmptyLectureOutput(),
    }));
  }, [clearDurationTimer]);

  const settlePendingPartial = useCallback(() => {
    const pending = bufferRef.current.activeSegment.trim();

    if (!pending) {
      return;
    }

    const wordCount = pending.match(/[\p{L}\p{N}]+/gu)?.length ?? 0;

    if (wordCount >= 4) {
      const cleaned = cleanTranscriptText(pending, true);

      bufferRef.current = {
        finalizedSegments: [...bufferRef.current.finalizedSegments, cleaned],
        activeSegment: "",
      };

      transcriptRef.current = [
        ...transcriptRef.current,
        {
          id: crypto.randomUUID(),
          text: cleaned,
          timestamp: new Date(),
          isFinal: true,
        },
      ];

      return;
    }

    bufferRef.current = {
      ...bufferRef.current,
      activeSegment: "",
    };
  }, []);

  const stopRecording = useCallback(() => {
    shouldKeepListeningRef.current = false;

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    settlePendingPartial();
    clearDurationTimer();
    syncDerivedState({
      isRecording: false,
      statusMessage: "Microphone stopped.",
    });
  }, [clearDurationTimer, settlePendingPartial, syncDerivedState]);

  const startRecording = useCallback(() => {
    const SpeechRecognitionConstructor =
      typeof window !== "undefined"
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : undefined;

    if (!SpeechRecognitionConstructor) {
      setState((prev) => ({
        ...prev,
        speechRecognitionSupported: false,
        statusMessage: "Speech recognition is not available in this browser. Use manual chunk input instead.",
      }));
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }

    clearDurationTimer();
    bufferRef.current = createEmptyLectureBuffer();
    transcriptRef.current = [];
    shouldKeepListeningRef.current = true;

    const recognition = new SpeechRecognitionConstructor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = INPUT_LANGUAGE_LOCALES[inputLanguageRef.current];

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript?.trim();

        if (!transcript) {
          continue;
        }

        if (event.results[index].isFinal) {
          commitFinalChunk(transcript);
        } else {
          interimTranscript = interimTranscript
            ? `${interimTranscript} ${transcript}`
            : transcript;
        }
      }

      if (interimTranscript) {
        replacePartialChunk(interimTranscript);
      } else if (bufferRef.current.activeSegment) {
        bufferRef.current = {
          ...bufferRef.current,
          activeSegment: "",
        };
        syncDerivedState({
          isRecording: true,
          statusMessage: "Listening to the microphone...",
        });
      }
    };

    recognition.onerror = (event) => {
      const message =
        SPEECH_ERROR_MESSAGES[event.error] ??
        "Speech recognition failed. Please retry and make sure microphone access is enabled.";

      const fatalError = ["audio-capture", "language-not-supported", "not-allowed", "service-not-allowed"].includes(
        event.error,
      );

      if (fatalError) {
        shouldKeepListeningRef.current = false;
        clearDurationTimer();
      }

      setState((prev) => ({
        ...prev,
        isRecording: fatalError ? false : prev.isRecording,
        statusMessage: message,
      }));
    };

    recognition.onend = () => {
      if (!shouldKeepListeningRef.current) {
        recognitionRef.current = null;
        clearDurationTimer();
        syncDerivedState({
          isRecording: false,
          statusMessage: "Microphone stopped.",
        });
        return;
      }

      try {
        recognition.start();
      } catch {
        recognitionRef.current = null;
        shouldKeepListeningRef.current = false;
        clearDurationTimer();
        syncDerivedState({
          isRecording: false,
          statusMessage: "Microphone paused unexpectedly. Start it again to continue.",
        });
      }
    };

    recognitionRef.current = recognition;

    setState((prev) => ({
      ...prev,
      isRecording: true,
      transcripts: [],
      currentPartial: "",
      translatedText: "",
      keywords: [],
      shortSummary: "",
      detailedSummary: [],
      detectedLanguage: "",
      duration: 0,
      statusMessage: "Requesting microphone access...",
      engineOutput: createEmptyLectureOutput(),
    }));

    durationRef.current = setInterval(() => {
      setState((prev) => ({ ...prev, duration: prev.duration + 1 }));
    }, 1000);

    try {
      recognition.start();
      setState((prev) => ({
        ...prev,
        statusMessage: "Listening to the microphone...",
      }));
    } catch {
      recognitionRef.current = null;
      shouldKeepListeningRef.current = false;
      clearDurationTimer();
      setState((prev) => ({
        ...prev,
        isRecording: false,
        statusMessage: "The microphone could not start. Check browser permission and try again.",
      }));
    }
  }, [clearDurationTimer, commitFinalChunk, replacePartialChunk, syncDerivedState]);

  const pushTranscriptChunk = useCallback(
    (chunk: string, isFinal: boolean) => {
      const normalizedChunk = chunk.trim();

      if (!normalizedChunk) {
        return;
      }

      if (isFinal) {
        const finalChunks = splitPastedTranscript(normalizedChunk, MANUAL_CHUNK_MAX_CHARS);

        for (const finalChunk of finalChunks) {
          appendTranscriptChunk(finalChunk, true);
        }

        return;
      }

      appendTranscriptChunk(normalizedChunk, isFinal);
    },
    [appendTranscriptChunk],
  );

  const setTargetLanguage = useCallback(
    (language: SupportedLanguageCode) => {
      targetLanguageRef.current = language;

      setState((prev) => ({
        ...prev,
        targetLanguage: language,
      }));

      syncDerivedState({
        isRecording: shouldKeepListeningRef.current,
      });
    },
    [syncDerivedState],
  );

  const setInputLanguage = useCallback((language: SupportedLanguageCode) => {
    inputLanguageRef.current = language;

    setState((prev) => ({
      ...prev,
      inputLanguage: language,
      statusMessage: prev.isRecording
        ? "Input language will apply the next time you start the microphone."
        : "Input language updated.",
    }));
  }, []);

  useEffect(() => {
    targetLanguageRef.current = state.targetLanguage;
  }, [state.targetLanguage]);

  useEffect(() => {
    inputLanguageRef.current = state.inputLanguage;
  }, [state.inputLanguage]);

  const finalizedTranscriptKey = state.transcripts.map((entry) => entry.text).join("\u0001");

  useEffect(() => {
    const finalizedTexts = state.transcripts.map((entry) => entry.text).filter(Boolean);

    if (finalizedTexts.length === 0) {
      return;
    }

    const sourceText = finalizedTexts.join(" ");
    const sourceLanguage = detectLanguage(sourceText);

    if (sourceLanguage === state.targetLanguage) {
      return;
    }

    const requestId = translationRequestRef.current + 1;
    translationRequestRef.current = requestId;

    const timer = setTimeout(() => {
      void (async () => {
        try {
          const sourceOutput = buildLectureOutput(
            {
              finalizedSegments: finalizedTexts,
              activeSegment: "",
            },
            sourceLanguage,
          );

          const [translatedSegments, translatedShortSummary, translatedDetailedSummary] =
            await Promise.all([
              translateTextsOnline(finalizedTexts, sourceLanguage, state.targetLanguage),
              sourceOutput.short_summary
                ? translateTextOnline(
                    sourceOutput.short_summary,
                    sourceLanguage,
                    state.targetLanguage,
                  )
                : Promise.resolve(""),
              sourceOutput.detailed_summary.length > 0
                ? translateTextsOnline(
                    sourceOutput.detailed_summary,
                    sourceLanguage,
                    state.targetLanguage,
                  )
                : Promise.resolve([] as string[]),
            ]);

          if (translationRequestRef.current !== requestId) {
            return;
          }

          const translatedText = translatedSegments.join("\n");

          setState((prev) => ({
            ...prev,
            translatedText: translatedText || prev.translatedText,
            shortSummary: translatedShortSummary || prev.shortSummary,
            detailedSummary:
              translatedDetailedSummary.length > 0
                ? translatedDetailedSummary
                : prev.detailedSummary,
            engineOutput: {
              ...prev.engineOutput,
              translated_text: translatedText || prev.engineOutput.translated_text,
              short_summary: translatedShortSummary || prev.engineOutput.short_summary,
              detailed_summary:
                translatedDetailedSummary.length > 0
                  ? translatedDetailedSummary
                  : prev.engineOutput.detailed_summary,
            },
          }));
        } catch {
          if (translationRequestRef.current !== requestId) {
            return;
          }
        }
      })();
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [finalizedTranscriptKey, state.targetLanguage]);

  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;

      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }

      clearDurationTimer();
    };
  }, [clearDurationTimer]);

  return {
    state,
    startRecording,
    stopRecording,
    setTargetLanguage,
    setInputLanguage,
    pushTranscriptChunk,
    resetSession,
  };
}

export function splitPastedTranscript(text: string, maxChars: number) {
  const normalizedParagraphs = text
    .split(/\n+/)
    .map((paragraph) => paragraph.replace(/\s+/g, " ").trim())
    .filter(Boolean);

  const chunks: string[] = [];

  for (const paragraph of normalizedParagraphs) {
    const sentences =
      paragraph.match(/[^.?!\u0964]+[.?!\u0964]?/g)?.map((sentence) => sentence.trim()).filter(Boolean) ??
      [paragraph];

    let currentChunk = "";

    for (const sentence of sentences) {
      if (sentence.length > maxChars) {
        if (currentChunk) {
          chunks.push(currentChunk);
          currentChunk = "";
        }

        chunks.push(...splitLongChunkByWords(sentence, maxChars));
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
  }

  return chunks;
}

function splitLongChunkByWords(text: string, maxChars: number) {
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
