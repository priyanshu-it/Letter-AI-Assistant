import type { Dispatch, SetStateAction } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Question } from "../types";

interface StepThreePanelProps {
  selectedTone: string;
  questions: Question[];
  answers: Record<string, string>;
  setStep: Dispatch<SetStateAction<1 | 2 | 3>>;
  handleReset: () => void;
}

export function StepThreePanel({
  selectedTone,
  questions,
  answers,
  setStep,
  handleReset,
}: StepThreePanelProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="mb-4">
        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Step 3 of 3</span>
        <h3 className="text-base font-bold text-slate-900 font-display mt-2">Active Draft Parameters</h3>
        <p className="text-xs text-slate-500">The drafted letter is based on these custom-configured parameters.</p>
      </div>

      <div className="space-y-3 border-t border-b border-slate-100 py-4 my-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-500">Style Tone:</span>
          <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold font-mono text-[10px]">{selectedTone}</span>
        </div>

        {questions.slice(0, 4).map((q) => (
          <div key={q.key} className="flex justify-between items-start text-xs gap-4">
            <span className="font-semibold text-slate-500 shrink-0">{q.label}:</span>
            <span className="text-slate-700 text-right font-medium truncate max-w-[200px]">{answers[q.key] || "N/A"}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-3">
        <button
          onClick={() => setStep(2)}
          className="flex-1 flex items-center justify-center space-x-1 text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors text-xs font-semibold py-2 rounded-lg cursor-pointer"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Modify Inputs</span>
        </button>
        <button
          onClick={handleReset}
          className="flex-1 flex items-center justify-center space-x-1 text-rose-600 hover:text-rose-700 border border-rose-100 hover:bg-rose-50/50 transition-colors text-xs font-semibold py-2 rounded-lg cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Draft</span>
        </button>
      </div>
    </div>
  );
}
