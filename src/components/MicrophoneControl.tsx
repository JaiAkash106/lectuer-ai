import { Clock, Mic, MicOff } from "lucide-react";
import type { SupportedLanguageCode } from "@/lib/lectureProcessor";

const INPUT_LANGUAGES: Array<{ code: SupportedLanguageCode; label: string }> = [
  { code: "en", label: "English" },
  { code: "ta", label: "Tamil" },
  { code: "hi", label: "Hindi" },
];

interface Props {
  isRecording: boolean;
  duration: number;
  detectedLanguage: string;
  inputLanguage: SupportedLanguageCode;
  speechRecognitionSupported: boolean;
  statusMessage: string;
  onInputLanguageChange: (language: SupportedLanguageCode) => void;
  onStart: () => void;
  onStop: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function MicrophoneControl({
  isRecording,
  duration,
  detectedLanguage,
  inputLanguage,
  speechRecognitionSupported,
  statusMessage,
  onInputLanguageChange,
  onStart,
  onStop,
}: Props) {
  return (
    <div className="glass-card rounded-xl p-6 animate-slide-up flex flex-col items-center gap-4">
      <div className="w-full space-y-2">
        <label className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
          Microphone input
        </label>
        <select
          value={inputLanguage}
          onChange={(event) => onInputLanguageChange(event.target.value as SupportedLanguageCode)}
          disabled={isRecording}
          className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-ring disabled:opacity-60"
        >
          {INPUT_LANGUAGES.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={isRecording ? onStop : onStart}
        disabled={!speechRecognitionSupported}
        className={`relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
          isRecording
            ? "bg-recording/15 hover:bg-recording/25"
            : "bg-primary/10 hover:bg-primary/20"
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-recording/20 recording-pulse" />
        )}
        {isRecording ? (
          <MicOff className="relative z-10 h-8 w-8 text-recording" />
        ) : (
          <Mic className="relative z-10 h-8 w-8 text-primary" />
        )}
      </button>

      <p className="text-sm font-medium text-foreground">
        {isRecording ? "Stop microphone" : "Start microphone"}
      </p>

      {isRecording && (
        <div className="flex items-center gap-4 animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-recording recording-pulse" />
            <span className="text-xs font-mono text-recording">LIVE</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs font-mono">{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {isRecording && (
        <div className="flex h-8 items-end gap-1">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="w-1 rounded-full bg-primary/60"
              style={{
                animation: "wave 0.8s ease-in-out infinite",
                animationDelay: `${index * 0.07}s`,
                height: "12px",
              }}
            />
          ))}
        </div>
      )}

      <p className="rounded-lg bg-secondary/50 px-3 py-2 text-center text-xs leading-5 text-muted-foreground">
        {statusMessage}
      </p>

      {detectedLanguage && (
        <span className="inline-flex items-center rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success">
          Detected: {detectedLanguage}
        </span>
      )}
    </div>
  );
}
