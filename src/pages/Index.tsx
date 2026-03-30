import { Header } from "@/components/Header";
import { MicrophoneControl } from "@/components/MicrophoneControl";
import { TranscriptPanel } from "@/components/TranscriptPanel";
import { TranslationPanel } from "@/components/TranslationPanel";
import { KeywordsPanel } from "@/components/KeywordsPanel";
import { SummarySection } from "@/components/SummarySection";
import { StreamInputPanel } from "@/components/StreamInputPanel";
import { useLectureAssistant } from "@/hooks/useLectureAssistant";

const Index = () => {
  const {
    state,
    startRecording,
    stopRecording,
    setTargetLanguage,
    setInputLanguage,
    pushTranscriptChunk,
    resetSession,
  } = useLectureAssistant();

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column: Mic + Keywords */}
          <div className="lg:col-span-3 space-y-6">
            <MicrophoneControl
              isRecording={state.isRecording}
              duration={state.duration}
              detectedLanguage={state.isRecording ? state.detectedLanguage : ""}
              inputLanguage={state.inputLanguage}
              speechRecognitionSupported={state.speechRecognitionSupported}
              statusMessage={state.statusMessage}
              onInputLanguageChange={setInputLanguage}
              onStart={startRecording}
              onStop={stopRecording}
            />
            <KeywordsPanel keywords={state.keywords} />
          </div>

          {/* Center: Transcript */}
          <div className="lg:col-span-5">
            <TranscriptPanel
              transcripts={state.transcripts}
              currentPartial={state.currentPartial}
            />
          </div>

          {/* Right column: Translation */}
          <div className="lg:col-span-4">
            <TranslationPanel
              translatedText={state.translatedText}
              targetLanguage={state.targetLanguage}
              onLanguageChange={setTargetLanguage}
            />
          </div>
        </div>

        <SummarySection
          shortSummary={state.shortSummary}
          detailedSummary={state.detailedSummary}
        />

        <StreamInputPanel
          onPushChunk={pushTranscriptChunk}
          onReset={resetSession}
        />
      </div>
    </div>
  );
};

export default Index;
