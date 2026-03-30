import { Braces } from "lucide-react";
import type { LectureEngineOutput } from "@/lib/lectureProcessor";

interface Props {
  output: LectureEngineOutput;
}

export function EngineOutputPanel({ output }: Props) {
  return (
    <div className="glass-card rounded-xl animate-slide-up" style={{ animationDelay: "0.3s" }}>
      <div className="flex items-center gap-2 p-4 border-b border-border/50">
        <Braces className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-semibold text-foreground">Engine JSON</h2>
      </div>

      <div className="p-4">
        <pre className="min-h-[260px] overflow-x-auto rounded-lg bg-secondary/60 p-4 text-xs leading-6 text-left text-foreground">
          {JSON.stringify(output, null, 2)}
        </pre>
      </div>
    </div>
  );
}
