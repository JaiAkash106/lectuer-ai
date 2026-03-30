import { useEffect, useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface Props {
  shortSummary: string;
  detailedSummary: string[];
}

export function SummarySection({ shortSummary, detailedSummary }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasSummary = Boolean(shortSummary);
  const takeawayCount = detailedSummary.length;

  useEffect(() => {
    if (takeawayCount > 0) {
      setExpanded(true);
      return;
    }

    setExpanded(false);
  }, [takeawayCount]);

  return (
    <div className="glass-card rounded-xl animate-slide-up" style={{ animationDelay: "0.25s" }}>
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Live Summary</h2>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          {takeawayCount > 0 ? `${takeawayCount} takeaways` : "Waiting for lecture context"}
        </span>
      </div>

      <div className="p-4 space-y-3">
        {!hasSummary ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            A short recap and key takeaways will appear as the lecture progresses...
          </p>
        ) : (
          <>
            <div className="rounded-lg border border-border/60 bg-background/40 p-3 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Overview
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {shortSummary}
              </p>
            </div>

            {takeawayCount > 0 && (
              <>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center justify-between w-full rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-left text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  <span>Key Takeaways</span>
                  <span className="flex items-center gap-1.5">
                    {expanded ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        Show
                      </>
                    )}
                  </span>
                </button>

                {expanded && (
                  <div className="animate-fade-in rounded-lg border border-border/60 bg-background/40 p-3">
                    <ul className="space-y-2 list-disc pl-5">
                      {detailedSummary.map((point) => (
                        <li key={point} className="text-sm text-foreground/80 leading-relaxed">
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
