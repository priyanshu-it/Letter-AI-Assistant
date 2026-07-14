import type { Dispatch, SetStateAction } from "react";
import { RotateCcw, Sparkles, Languages, X, NotebookTabs, CopyCheckIcon, FileText } from "lucide-react";

interface SidebarContentProps {
  step: 1 | 2 | 3;
  handleReset: () => void;
  isMobile?: boolean;
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export function SidebarContent({
  step,
  handleReset,
  isMobile = false,
  setMobileMenuOpen,
}: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative p-[2px] rounded overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>

            <div className="relative w-8 h-8 bg-indigo-900 rounded flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-white font-semibold tracking-tight block">LetterAI Assistant</span>
            <span className="text-[10px] text-sky-400 font-medium block animate-pulse opacity-90">Developed By Priyanshu</span>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4 text-slate-400 text-600 hover:text-white" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">Assistant Tasks</div>

        <button
          id={isMobile ? "mobile-btn-nav-assistant" : "btn-nav-assistant"}
          onClick={() => {
            if (isMobile) setMobileMenuOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-600/10 cursor-pointer text-left"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Assistant UI</span>
        </button>

        {step > 1 && (
          <button
            id={isMobile ? "mobile-btn-sidebar-restart" : "btn-sidebar-restart"}
            onClick={() => {
              handleReset();
              if (isMobile) setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200 cursor-pointer text-left"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Fresh</span>
          </button>
        )}

        <div className="pt-6 border-t border-slate-800/60 mt-6">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">Workflow Progress</div>

          <div className="space-y-4 px-2">
            <div className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 transition-colors ${step >= 1 ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-700 text-slate-500"
                }`}>
                1
              </div>
              <div>
                <span className={`text-[11px] font-medium block ${step >= 1 ? "text-slate-200" : "text-slate-500"}`}>Describe Concept</span>
                <span className="text-[9px] text-slate-500 block leading-tight">Outline requirements</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 transition-colors ${step >= 2 ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-700 text-slate-500"
                }`}>
                2
              </div>
              <div>
                <span className={`text-[11px] font-medium block ${step >= 2 ? "text-slate-200" : "text-slate-500"}`}>Adaptive Form</span>
                <span className="text-[9px] text-slate-500 block leading-tight">Fill analyzed fields</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border shrink-0 transition-colors ${step >= 3 ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-700 text-slate-500"
                }`}>
                3
              </div>
              <div>
                <span className={`text-[11px] font-medium block ${step >= 3 ? "text-slate-200" : "text-slate-500"}`}>Letter Draft</span>
                <span className="text-[9px] text-slate-500 block leading-tight">Review, copy & edit</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

    </div>
  );
}
