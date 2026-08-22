import type { Dispatch, FormEvent, SetStateAction } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Question } from "../types";

interface StepTwoPanelProps {
  questions: Question[];
  answers: Record<string, string>;
  setAnswers: Dispatch<SetStateAction<Record<string, string>>>;
  selectedTone: string;
  setSelectedTone: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleGenerateCorrespondence: (event: FormEvent) => void;
  setStep: Dispatch<SetStateAction<1 | 2 | 3>>;
}

const toneOptions = ["Formal", "Professional", "Friendly", "Persuasive", "Warm"];

export function StepTwoPanel({
  questions,
  answers,
  setAnswers,
  selectedTone,
  setSelectedTone,
  loading,
  handleGenerateCorrespondence,
  setStep,
}: StepTwoPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-100">
        <div>
          <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Step 2 of 3</span>
          <h3 className="text-base font-bold text-slate-900 font-display mt-2">Required Details for Drafting</h3>
          <p className="text-[10px] text-slate-500 mt-1">Our AI identified these specific variables needed to craft high-context formal drafts.</p>
        </div>
        <button
          id="btn-back-step1"
          onClick={() => setStep(1)}
          className="flex items-center space-x-1 text-slate-500 hover:text-slate-900 transition-colors text-[10px] font-semibold px-2 py-1 rounded-lg hover:bg-slate-50 cursor-pointer border border-slate-200"
        >
          <ArrowLeft className="w-3 h-3" />
          <span>Change Outline</span>
        </button>
      </div>

      <form onSubmit={handleGenerateCorrespondence} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-2">Select Style Tone:</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {toneOptions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTone(t)}
                className={`py-1.5 px-2 text-[10px] font-semibold rounded-lg text-center border cursor-pointer transition-all duration-150 ${selectedTone === t
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3.5">
          {questions.map((q) => (
            <div key={q.key}>
              <label htmlFor={`field-${q.key}`} className="block text-xs font-semibold text-slate-700 mb-1">
                {q.label} {q.required && <span className="text-rose-500">*</span>}
              </label>
              {q.type === "textarea" ? (
                <textarea
                  id={`field-${q.key}`}
                  rows={2}
                  required={q.required}
                  placeholder={q.placeholder}
                  value={answers[q.key] || ""}
                  onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 resize-none bg-slate-50 focus:bg-white text-slate-700"
                />
              ) : (
                <input
                  id={`field-${q.key}`}
                  type="text"
                  required={q.required}
                  placeholder={q.placeholder}
                  value={answers[q.key] || ""}
                  onChange={(e) => setAnswers({ ...answers, [q.key]: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 bg-slate-50 focus:bg-white text-slate-700"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <span className="text-[10px] text-slate-400 font-mono">* Fields are mandatory</span>
          <button
            id="btn-draft-submit"
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-tr from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-indigo-400 disabled:to-violet-400 text-white font-semibold text-xs rounded-lg transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-100 cursor-pointer disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Generating Bilingual Draft...</span>
              </>
            ) : (
              <>
                <span>Draft Letter & Email</span>
                <Sparkles className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
