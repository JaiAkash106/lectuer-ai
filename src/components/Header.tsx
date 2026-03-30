import { BookOpen, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <header className="flex items-center justify-between px-6 py-4 glass-card rounded-xl animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Lectuer<span className="text-gradient"> AI</span>
          </h1>
          <p className="text-xs text-muted-foreground">Real-Time Multilingual Assistant</p>
        </div>
      </div>
      <button
        onClick={() => setIsDark(!isDark)}
        className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-4 h-4 text-secondary-foreground" /> : <Moon className="w-4 h-4 text-secondary-foreground" />}
      </button>
    </header>
  );
}
