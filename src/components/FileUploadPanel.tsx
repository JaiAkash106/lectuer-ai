import { useMemo, useState, type ChangeEvent } from "react";
import { Download, FileText, Languages, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  detectLanguage,
  translateText,
  type SupportedLanguageCode,
} from "@/lib/lectureProcessor";
import {
  buildTranslatedDownloadName,
  countLectureWords,
  extractTextFromLectureFile,
  splitLectureFileIntoBlocks,
} from "@/lib/lectureFile";
import { PartialTranslationError, translateTextsOnline } from "@/lib/onlineTranslation";

interface Props {
  targetLanguage: SupportedLanguageCode;
}

export function FileUploadPanel({ targetLanguage }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState<SupportedLanguageCode | null>(null);
  const [sourceFileType, setSourceFileType] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Upload a lecture file to extract the full text, translate it, and download a translated output.",
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const sourceWordCount = useMemo(() => countLectureWords(sourceText), [sourceText]);
  const translatedWordCount = useMemo(() => countLectureWords(translatedText), [translatedText]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setSelectedFile(file);
    setSourceText("");
    setTranslatedText("");
    setSourceLanguage(null);
    setSourceFileType("");
    setStatusMessage(
      file
        ? `Selected ${file.name}. Click Translate File to extract and process it.`
        : "Upload a lecture file to extract the full text, translate it, and download a translated output.",
    );
  };

  const handleTranslateFile = async () => {
    if (!selectedFile) {
      setStatusMessage("Choose a TXT, PDF, or DOCX lecture file first.");
      return;
    }

    setIsProcessing(true);
    setStatusMessage(`Reading ${selectedFile.name}...`);
    setTranslatedText("");

    try {
      const extracted = await extractTextFromLectureFile(selectedFile);

      if (!extracted.text) {
        setSourceText("");
        setSourceLanguage(null);
        setSourceFileType("");
        setStatusMessage("No readable text was found in that file.");
        return;
      }

      const detected = detectLanguage(extracted.text);
      const blocks = splitLectureFileIntoBlocks(extracted.text, 420);
      const fallbackBlocks = blocks.map((block) => translateText(block, detected, targetLanguage));
      const workingTranslations = [...fallbackBlocks];

      setSourceText(extracted.text);
      setSourceLanguage(detected);
      setSourceFileType(extracted.fileTypeLabel);
      setTranslatedText(workingTranslations.join("\n\n"));
      setStatusMessage(
        `Extracted ${blocks.length} text block${blocks.length === 1 ? "" : "s"} from ${selectedFile.name}. Built the baseline translation and started improving it online...`,
      );

      try {
        const translatedBlocks = await translateTextsOnline(blocks, detected, targetLanguage, {
          onProgress: (completed, total) => {
            setStatusMessage(`Translating ${selectedFile.name}: section ${completed} of ${total}...`);
          },
          onPartialResult: (translatedBlock, completed, total, index) => {
            workingTranslations[index] = translatedBlock;
            setTranslatedText(workingTranslations.join("\n\n"));
            setStatusMessage(
              `Improving ${selectedFile.name}: upgraded ${completed} of ${total} sections with online translation...`,
            );
          },
          requestSpacingMs: 1800,
        });

        setTranslatedText(translatedBlocks.join("\n\n"));
        setStatusMessage(
          `Processed ${selectedFile.name} as ${extracted.fileTypeLabel}. The translated file is ready to preview and download.`,
        );
      } catch (error) {
        if (error instanceof PartialTranslationError) {
          error.partialResults.forEach((translatedBlock, index) => {
            workingTranslations[index] = translatedBlock;
          });
          setTranslatedText(workingTranslations.join("\n\n"));
          setStatusMessage(
            `${error.message} Kept the baseline translation for the remaining sections and upgraded ${error.completed} of ${error.total} sections online. Click Translate File again to continue improving it from cache.`,
          );
          return;
        }

        if (error instanceof Error && error.message.toLowerCase().includes("rate limited")) {
          setTranslatedText(workingTranslations.join("\n\n"));
          setStatusMessage(
            `${error.message} Showing the baseline local translation now. Retry later to upgrade more sections with online translation.`,
          );
          return;
        }

        setTranslatedText(workingTranslations.join("\n\n"));
        setStatusMessage(
          error instanceof Error
            ? `${error.message} Showing the baseline local translation for this file.`
            : "Online translation failed, so the file was translated using the local fallback.",
        );
      }
    } catch (error) {
      setTranslatedText("");
      setStatusMessage(
        error instanceof Error
          ? error.message
          : "The file could not be processed. Try a TXT, PDF, or DOCX lecture file.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!selectedFile || !translatedText) {
      return;
    }

    const blob = new Blob([translatedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = buildTranslatedDownloadName(selectedFile.name, targetLanguage);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="glass-card rounded-xl animate-slide-up" style={{ animationDelay: "0.4s" }}>
      <div className="flex items-center justify-between gap-3 p-4 border-b border-border/50">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Lecture File Translation</h2>
          <p className="text-xs text-muted-foreground">
            Upload a lecture file, translate the full content, and download a translated `.txt` copy.
          </p>
        </div>
        <div className="text-xs text-muted-foreground">
          Target: <span className="text-foreground font-medium uppercase">{targetLanguage}</span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_auto_auto] gap-3 items-end">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Lecture File</label>
            <Input
              type="file"
              accept=".txt,.md,.json,.pdf,.docx"
              onChange={handleFileChange}
              className="bg-secondary/30"
            />
          </div>
          <Button type="button" onClick={handleTranslateFile} disabled={!selectedFile || isProcessing}>
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            Translate File
          </Button>
          <Button type="button" variant="secondary" onClick={handleDownload} disabled={!translatedText}>
            <Download className="w-4 h-4" />
            Download Output
          </Button>
        </div>

        <div className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm text-muted-foreground">
          {statusMessage}
        </div>

        {(selectedFile || sourceText || translatedText) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-muted-foreground">
            <div className="rounded-lg border border-border/60 bg-background/30 px-3 py-2">
              <span className="font-medium text-foreground">File</span>
              <div>{selectedFile?.name ?? "No file selected"}</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/30 px-3 py-2">
              <span className="font-medium text-foreground">Detected</span>
              <div>{sourceLanguage ? `${sourceLanguage.toUpperCase()} - ${sourceFileType}` : "Pending"}</div>
            </div>
            <div className="rounded-lg border border-border/60 bg-background/30 px-3 py-2">
              <span className="font-medium text-foreground">Words</span>
              <div>{sourceWordCount > 0 ? `${sourceWordCount} source - ${translatedWordCount} translated` : "Pending"}</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/60 bg-background/30 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Source Preview</h3>
            </div>
            <div className="p-4 min-h-[220px] max-h-[340px] overflow-y-auto whitespace-pre-wrap text-sm text-foreground/85">
              {sourceText || "The extracted lecture text will appear here after you upload and process a file."}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/30 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
              <Languages className="w-4 h-4 text-accent" />
              <h3 className="text-sm font-semibold text-foreground">Translated Preview</h3>
            </div>
            <div className="p-4 min-h-[220px] max-h-[340px] overflow-y-auto whitespace-pre-wrap text-sm text-foreground/85">
              {translatedText || "The translated lecture file will appear here, and you can download it as a text file."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
