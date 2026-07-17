import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Check, Copy, Eye, FileText, Mail, Pencil } from "lucide-react";
import { Correspondence } from "../types";

interface OutputPanelProps {
  draftResult: Correspondence | null;
  activeLang: "english" | "hindi";
  setActiveLang: Dispatch<SetStateAction<"english" | "hindi">>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  handleCopyToClipboard: () => void;
  handleTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  copied: boolean;
}

export function OutputPanel({
  draftResult,
  activeLang,
  setActiveLang,
  isEditing,
  setIsEditing,
  handleCopyToClipboard,
  handleTextChange,
  copied,
}: OutputPanelProps) {
  const downloadDraft = () => {
    if (!draftResult) return;
    const text = activeLang === "english" ? draftResult.english : draftResult.hindi;
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${activeLang}_draft.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleSendEmail = () => {
    if (!draftResult) return;
    const text = activeLang === "english" ? draftResult.english : draftResult.hindi;
    const mailtoLink = `mailto:?body=${encodeURIComponent(text)}`;
    window.location.href = mailtoLink;
  };

  if (!draftResult) {
    return (
      <div className="relative p-[2px] rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 animate-spin [animation-duration:10s]"></div>
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center min-h-[450px] relative overflow-hidden">
          <div className="absolute inset-0 bg-slate-50/50 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-60" />
          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-4 z-10">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 mb-2 z-10 font-display">Awaiting AI Formulation</h4>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed z-10 mb-6">
            Complete Step 1 and Step 2 on the left side to extract key parameters and render a custom translation draft.
          </p>
          <div className="w-full max-w-xs space-y-2.5 opacity-30 z-10">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="h-3 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-4/5" />
            <div className="h-3 bg-slate-200 rounded w-full" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 mb-4 gap-3">
        <div>
          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Letter Output</span>
          <h3 className="text-base font-bold text-slate-900 font-display mt-1">Rendered Correspondence</h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-toggle-edit"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${isEditing
              ? "bg-indigo-50 border-indigo-200 text-indigo-700"
              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
              }`}
          >
            {isEditing ? <Eye className="w-3 h-3" /> : <Pencil className="w-3 h-3" />}
            <span>{isEditing ? "View Live" : "Edit"}</span>
          </button>

          <button
            id="btn-copy-draft"
            onClick={handleCopyToClipboard}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all duration-200 cursor-pointer ${copied ? "bg-emerald-600" : "bg-slate-900 hover:bg-slate-800 shadow-xs"
              }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg mb-4">
        <button
          id="btn-lang-en"
          onClick={() => {
            setActiveLang("english");
            setIsEditing(false);
          }}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${activeLang === "english"
            ? "bg-white text-slate-900 shadow-xs"
            : "text-slate-600 hover:text-slate-900"
            }`}
        >
          <span>English Draft</span>
        </button>
        <button
          id="btn-lang-hi"
          onClick={() => {
            setActiveLang("hindi");
            setIsEditing(false);
          }}
          className={`flex-1 flex items-center justify-center space-x-1.5 py-1.5 rounded-md text-xs font-bold transition-all duration-150 cursor-pointer ${activeLang === "hindi"
            ? "bg-white text-slate-900 shadow-xs"
            : "text-slate-600 hover:text-slate-900"
            }`}
        >
          <span>Hindi Draft (हिन्दी)</span>
        </button>
      </div>

      <div className="relative border border-slate-200 rounded-xl bg-[#fafafa] p-6 min-h-[350px] shadow-inner font-sans">
        {isEditing ? (
          <textarea
            id="draft-editor-textarea"
            className="w-full min-h-[300px] bg-white border border-indigo-200 rounded-xl p-4 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-sans resize-y"
            value={activeLang === "english" ? draftResult.english : draftResult.hindi}
            onChange={handleTextChange}
          />
        ) : (
          <div
            id="draft-text-display"
            className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line"
            style={{ fontVariantNumeric: "lining-nums" }}
          >
            {activeLang === "english" ? draftResult.english : draftResult.hindi}
          </div>
        )}

        <div className="absolute bottom-3 right-3 text-[9px] text-slate-400 font-mono tracking-tight bg-white px-2 py-0.5 rounded border border-slate-100">
          {activeLang.toUpperCase()} | {isEditing ? "EDIT MODE" : "READ ONLY"}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
        <span>Verification suggested before dispatch.</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSendEmail}
            className="flex items-center space-x-1 hover:text-slate-900 font-semibold cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-indigo-900" />
            <span>Send Email</span>
          </button>

          {/* <button
            onClick={downloadDraft}
            className="flex items-center space-x-1 hover:text-slate-900 font-semibold cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-900" />
            <span>Download TXT</span>
          </button> */}
        </div>
      </div>
    </div>
  );
}