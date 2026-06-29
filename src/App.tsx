import React, { useState } from "react";
import { Menu, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Question, Correspondence } from "./types";
import { SidebarContent } from "./components/SidebarContent";
import { StepOnePanel } from "./components/StepOnePanel";
import { StepTwoPanel } from "./components/StepTwoPanel";
import { StepThreePanel } from "./components/StepThreePanel";
import { OutputPanel } from "./components/OutputPanel";

export default function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState("");
  const [selectedTone, setSelectedTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const [draftResult, setDraftResult] = useState<Correspondence | null>(null);
  const [activeLang, setActiveLang] = useState<"english" | "hindi">("english");
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectPreset = (promptText: string) => {
    setTopic(promptText);
    setErrorMsg(null);
  };

  const handleAnalyzeRequirements = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      setErrorMsg("Please enter a short description or select a template above.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const serverError = data && data.error ? data.error : "Failed to connect to the assistant server. Please verify your connection.";
        throw new Error(serverError);
      }

      setQuestions(data.questions || []);
      setSelectedTone(data.suggestedTone || "Professional");

      const initialAnswers: Record<string, string> = {};
      (data.questions || []).forEach((q: Question) => {
        initialAnswers[q.key] = "";
      });
      setAnswers(initialAnswers);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCorrespondence = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const q of questions) {
      if (q.required && !answers[q.key]?.trim()) {
        setErrorMsg(`Please fill out the required field: "${q.label}"`);
        return;
      }
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/generate-correspondence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          tone: selectedTone,
          answers,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        const serverError = data && data.error ? data.error : "Failed to generate content from the server.";
        throw new Error(serverError);
      }

      setDraftResult(data);
      setActiveLang("english");
      setIsEditing(false);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Drafting failed. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setTopic("");
    setQuestions([]);
    setAnswers({});
    setDraftResult(null);
    setErrorMsg(null);
    setIsEditing(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!draftResult) return;
    setDraftResult({
      ...draftResult,
      [activeLang]: e.target.value,
    });
  };

  const handleCopyToClipboard = () => {
    const text = activeLang === "english" ? draftResult?.english : draftResult?.hindi;
    if (text) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-row overflow-hidden">
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed top-0 bottom-0 left-0 w-64 z-50 md:hidden shadow-2xl"
            >
              <SidebarContent step={step} handleReset={handleReset} isMobile setMobileMenuOpen={setMobileMenuOpen} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden md:flex flex-col w-64 shrink-0 border-r border-slate-800">
        <SidebarContent step={step} handleReset={handleReset} setMobileMenuOpen={setMobileMenuOpen} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="btn-mobile-menu"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden w-8 h-8 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded flex items-center justify-center text-white font-bold shadow-md cursor-pointer transition-colors"
              title="Open menu"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 tracking-tight">Letter & Email Writer</h2>
              <p className="text-[10px] text-slate-500 font-medium">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                id="btn-restart-flow"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Start Fresh</span>
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto w-full"
          >
            <div className="lg:col-span-6 space-y-6">
              {errorMsg && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-3 text-rose-800 text-xs">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="flex-1">{errorMsg}</span>
                  <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-rose-600 font-bold font-mono text-[10px] cursor-pointer">Dismiss</button>
                </div>
              )}

              {step === 1 && (
                <StepOnePanel
                  topic={topic}
                  setTopic={setTopic}
                  loading={loading}
                  handleAnalyzeRequirements={handleAnalyzeRequirements}
                  handleSelectPreset={handleSelectPreset}
                  setErrorMsg={setErrorMsg}
                />
              )}

              {step === 2 && (
                <StepTwoPanel
                  questions={questions}
                  answers={answers}
                  setAnswers={setAnswers}
                  selectedTone={selectedTone}
                  setSelectedTone={setSelectedTone}
                  loading={loading}
                  handleGenerateCorrespondence={handleGenerateCorrespondence}
                  setStep={setStep}
                />
              )}

              {step === 3 && (
                <StepThreePanel
                  selectedTone={selectedTone}
                  questions={questions}
                  answers={answers}
                  setStep={setStep}
                  handleReset={handleReset}
                />
              )}
            </div>

            <div className="lg:col-span-6">
              <OutputPanel
                draftResult={draftResult}
                activeLang={activeLang}
                setActiveLang={setActiveLang}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                handleCopyToClipboard={handleCopyToClipboard}
                handleTextChange={handleTextChange}
                copied={copied}
              />
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
