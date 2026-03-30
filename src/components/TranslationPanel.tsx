import { useEffect, useRef } from "react";
import { Languages } from "lucide-react";

const LANGUAGES = [
  { code: "ta", label: "Tamil" },
  { code: "en", label: "English" },
  { code: "hi", label: "Hindi" },
];

interface Props {
  translatedText: string;
  targetLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function TranslationPanel({ translatedText, targetLanguage, onLanguageChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [translatedText]);

  return (
    <div className="glass-card rounded-xl flex flex-col h-full animate-slide-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Languages className="w-4 h-4 text-accent" />
          <h2 className="text-sm font-semibold text-foreground">Translation</h2>
        </div>
        <select
          value={targetLanguage}
          onChange={(e) => onLanguageChange(e.target.value)}
          className="text-xs rounded-md border border-border bg-secondary text-secondary-foreground px-2 py-1 outline-none focus:ring-1 focus:ring-ring"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 min-h-[200px] max-h-[400px] auto-scroll">
        {!translatedText ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            Translations will appear here...
          </p>
        ) : (
          <div className="space-y-2">
            {translatedText.split("\n").map((line, i) => (
              <p key={i} className="text-sm text-foreground leading-relaxed animate-fade-in">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
