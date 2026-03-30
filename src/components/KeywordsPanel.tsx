import { Tag } from "lucide-react";

interface Props {
  keywords: string[];
}

export function KeywordsPanel({ keywords }: Props) {
  return (
    <div className="glass-card rounded-xl animate-slide-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center gap-2 p-4 border-b border-border/50">
        <Tag className="w-4 h-4 text-warning" />
        <h2 className="text-sm font-semibold text-foreground">Keywords</h2>
        {keywords.length > 0 && (
          <span className="ml-auto text-[10px] font-mono text-muted-foreground">
            {keywords.length} extracted
          </span>
        )}
      </div>

      <div className="p-4">
        {keywords.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Keywords will be extracted in real time...
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword, i) => (
              <span
                key={keyword}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-keyword/12 text-primary border border-primary/20 animate-scale-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
