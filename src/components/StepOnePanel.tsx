import type { Dispatch, FormEvent, SetStateAction } from "react";
import { ArrowRight } from "lucide-react";
import { PRESET_TOPICS } from "../data";
import { PresetIcon } from "./PresetIcon";

interface StepOnePanelProps {
  topic: string;
  setTopic: Dispatch<SetStateAction<string>>;
  loading: boolean;
  handleAnalyzeRequirements: (event: FormEvent) => void;
  handleSelectPreset: (promptText: string) => void;
  setErrorMsg: Dispatch<SetStateAction<string | null>>;
}

export function StepOnePanel({
  topic,
  setTopic,
  loading,
  handleAnalyzeRequirements,
  handleSelectPreset,
  setErrorMsg,
}: StepOnePanelProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="mb-6">
        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Step 1 of 3</span>
        <h3 className="text-base font-bold text-slate-900 font-display mt-2">What kind of correspondence do you need?</h3>
        <p className="text-xs text-slate-500 mt-1">Enter a custom description of the letter/email you wish to draft.</p>
      </div>

      {/* <div className="hidden sm:grid grid-cols-3 gap-3 mb-6">
        {PRESET_TOPICS.map((preset) => (
          <button
            key={preset.id}
            id={`preset-${preset.id}`}
            type="button"
            onClick={() => handleSelectPreset(preset.prompt)}
            className={`group text-left p-3.5 rounded-xl border transition-all duration-200 flex space-x-3 items-start cursor-pointer ${topic === preset.prompt
                ? "border-indigo-600 bg-indigo-50/30 ring-1 ring-indigo-600/30"
                : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
          >
            <div className={`p-2 rounded-lg shrink-0 transition-colors ${topic === preset.prompt ? "bg-white shadow-xs" : "bg-slate-100 group-hover:bg-white"
              }`}>
              <PresetIcon iconName={preset.icon} className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{preset.title}</h4>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">{preset.description}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="hidden sm:block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">OR</div> 
      */}
      
      <form onSubmit={handleAnalyzeRequirements} className="space-y-4 border-t border-slate-100 pt-5">
        <div>
          <label htmlFor="input-topic" className="block text-xs font-bold text-slate-800 mb-2">
            Describe your requirements or write custom details:
          </label>
          <textarea
            id="input-topic"
            rows={4}
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setErrorMsg(null);
            }}
            placeholder="e.g., I need a formal email to my landlord asking for a 5-day extension on my house rent because my salary is delayed."
            className="w-full rounded-xl border border-slate-200 px-3.5 py-3 text-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all duration-200 resize-none bg-slate-50 focus:bg-white leading-relaxed text-slate-700"
          />
        </div>

        <div className="flex justify-end">
          <button
            id="btn-analyze-submit"
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs rounded-lg transition-all duration-200 shadow-md hover:shadow-lg shadow-indigo-100 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Extracting Requirements...</span>
              </>
            ) : (
              <>
                <span>Formulate Details Form</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
