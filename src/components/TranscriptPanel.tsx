import { useEffect, useRef, useState } from "react";
import { FileText, Clock } from "lucide-react";
import type { TranscriptEntry } from "@/hooks/useLectureAssistant";

interface Props {
  transcripts: TranscriptEntry[];
  currentPartial: string;
}

export function TranscriptPanel({ transcripts, currentPartial }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showTimestamps, setShowTimestamps] = useState(true);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcripts, currentPartial]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <div className="glass-card rounded-xl flex flex-col h-full animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Live Transcript</h2>
        </div>
        <button
          onClick={() => setShowTimestamps(!showTimestamps)}
          className={`p-1.5 rounded-md transition-colors ${showTimestamps ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary"}`}
        >
          <Clock className="w-3.5 h-3.5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 auto-scroll min-h-[200px] max-h-[400px]">
        {transcripts.length === 0 && !currentPartial && (
          <p className="text-sm text-muted-foreground text-center py-8">
            Start recording to see live transcription...
          </p>
        )}

        {transcripts.map((entry) => (
          <div key={entry.id} className="animate-fade-in">
            {showTimestamps && (
              <span className="text-[10px] font-mono text-muted-foreground">
                {formatTime(entry.timestamp)}
              </span>
            )}
            <p className="text-sm text-foreground leading-relaxed">{entry.text}</p>
          </div>
        ))}

        {currentPartial && (
          <div className="animate-fade-in">
            <p className="text-sm text-muted-foreground italic">
              {currentPartial}
              <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
