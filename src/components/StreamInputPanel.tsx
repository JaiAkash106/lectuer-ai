import { useState } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  onPushChunk: (chunk: string, isFinal: boolean) => void;
  onReset: () => void;
}

export function StreamInputPanel({ onPushChunk, onReset }: Props) {
  const [value, setValue] = useState("");

  const submitChunk = (isFinal: boolean) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return;
    }

    onPushChunk(trimmed, isFinal);
    setValue("");
  };

  return (
    <div className="glass-card rounded-xl animate-slide-up" style={{ animationDelay: "0.35s" }}>
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border/50">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Chunk Input</h2>
          <p className="text-xs text-muted-foreground">
            Feed partial or final speech-to-text chunks into the engine. Long pasted text is split automatically.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onReset}>
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </div>

      <div className="p-4 space-y-3">
        <Textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Paste the latest transcript chunk or a longer lecture passage here..."
          className="min-h-[120px] resize-none bg-secondary/40"
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" className="flex-1" onClick={() => submitChunk(false)}>
            <Send className="w-3.5 h-3.5" />
            Add Partial Chunk
          </Button>
          <Button type="button" variant="secondary" className="flex-1" onClick={() => submitChunk(true)}>
            <Send className="w-3.5 h-3.5" />
            Commit Final Chunk
          </Button>
        </div>
      </div>
    </div>
  );
}
