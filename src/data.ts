import { PresetTopic } from "./types";

export const PRESET_TOPICS: PresetTopic[] = [
  {
    id: "resignation",
    title: "Job Resignation",
    icon: "Briefcase",
    description: "Formally resign from your job while maintaining a warm and professional bridge.",
    prompt: "A formal job resignation letter stating my departure and two-week notice period."
  },
  {
    id: "cover-letter",
    title: "Job Cover Letter",
    icon: "FileText",
    description: "Introduce yourself, highlight key achievements, and pitch your fit for a job position.",
    prompt: "An elegant cover letter applying for a Senior Software Engineer position."
  },
  {
    id: "rent-extension",
    title: "Rent Extension Request",
    icon: "Home",
    description: "Request your landlord for a temporary extension on rent payment with a valid explanation.",
    prompt: "A polite letter to my landlord requesting a 10-day extension on the monthly rent."
  },
  {
    id: "medical-leave",
    title: "Sick Leave Notification",
    icon: "Calendar",
    description: "Request formal leave from your manager or school authority due to medical reasons.",
    prompt: "A short leave request email to my manager asking for sick leave due to fever."
  },
  {
    id: "business-proposal",
    title: "Business Follow-up",
    icon: "Send",
    description: "A persuasive email following up on a business partnership proposal with clear next steps.",
    prompt: "A follow-up email to a prospective partner after an initial meeting about a software collaboration."
  }
];

export const BACKEND_CODE_STRING = `import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI SDK with user API key safely on server side
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });
  }
  return aiClient;
}

/**
 * Endpoint 1: Analyze user request to extract necessary inputs
 */
app.post("/api/analyze-requirements", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) return res.status(400).json({ error: "Topic is required" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback interactive response for keyless environments
      return res.json({
        suggestedTone: "Professional",
        questions: [
          { key: "recipientName", label: "Recipient Name / Title", placeholder: "e.g. Hiring Manager", type: "text", required: true },
          { key: "senderName", label: "Your Name", placeholder: "e.g. Amit Sharma", type: "text", required: true },
          { key: "keyPoints", label: "Key Points to Include", placeholder: "e.g. Leave from Oct 5 to Oct 10 due to sibling wedding", type: "textarea", required: true },
          { key: "urgency", label: "Additional Context", placeholder: "e.g. High priority, fallback coverage ready", type: "text", required: false }
        ]
      });
    }

    const ai = getGeminiClient();
    const systemPrompt = \`You are an expert correspondence writer. Analyze the user's request and suggest 3 to 5 key details to collect in a form to write a perfect letter or email.
Topic: "\${topic}"\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTone: { type: Type.STRING },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  label: { type: Type.STRING },
                  placeholder: { type: Type.STRING },
                  type: { type: Type.STRING },
                  required: { type: Type.BOOLEAN }
                },
                required: ["key", "label", "placeholder", "type", "required"]
              }
            }
          },
          required: ["suggestedTone", "questions"]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Endpoint 2: Draft bilingual letters/emails using Gemini API
 */
app.post("/api/generate-correspondence", async (req, res) => {
  try {
    const { topic, tone, answers } = req.body;
    if (!topic || !tone || !answers) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Offline mock data
      return res.json({
        english: \`Subject: Regarding: \${topic}\\n\\nDear \${answers.recipientName || 'Recipient'},\\n\\nI am writing to you regarding \${topic}.\\n\\nDetails:\\n\${answers.keyPoints || 'N/A'}\\n\\nRegards,\\n\${answers.senderName || 'Sender'}\`,
        hindi: \`विषय: \${topic} के संबंध में\\n\\nप्रिय \${answers.recipientName || 'प्राप्तकर्ता'},\\n\\nमैं आपको \${topic} के संबंध में लिख रहा हूँ।\\n\\nविवरण:\\n\${answers.keyPoints || 'N/A'}\\n\\nसादर,\\n\${answers.senderName || 'प्रेषक'}\`
      });
    }

    const ai = getGeminiClient();
    const systemPrompt = \`Draft a letter based on:
Topic: "\${topic}"
Tone: "\${tone}"
Answers: \${JSON.stringify(answers)}

Provide output in English and high-quality official Hindi translation (Devanagari script). Ensure natural flow, proper greeting and formal sign-off.\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING, description: "Formatted English letter/email with newlines" },
            hindi: { type: Type.STRING, description: "Formatted Hindi letter/email with newlines" }
          },
          required: ["english", "hindi"]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend assets & Vite dev integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Server listening on port \${PORT}\`);
  });
}

startServer();`;

export const FRONTEND_CODE_STRING = `import React, { useState } from "react";
import { Copy, Check, RotateCcw, ArrowRight, Languages } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"app" | "code">("app");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("Professional");
  const [loading, setLoading] = useState(false);
  
  // Custom generated questionnaire
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  // Generated result
  const [result, setResult] = useState<any>(null);
  const [language, setLanguage] = useState<"english" | "hindi">("english");
  const [copied, setCopied] = useState(false);

  // Analyze prompt & retrieve required fields
  const handleAnalyze = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      setQuestions(data.questions || []);
      setTone(data.suggestedTone || "Professional");
      
      // Seed initial answers map
      const initialAnswers: Record<string, string> = {};
      data.questions.forEach((q: any) => {
        initialAnswers[q.key] = "";
      });
      setAnswers(initialAnswers);
      setStep(2);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Draft letter based on details
  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate-correspondence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, answers })
      });
      const data = await res.json();
      setResult(data);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = language === "english" ? result?.english : result?.hindi;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* App logic goes here... See full code viewer in the actual presentation tab */}
    </div>
  );
}`;
