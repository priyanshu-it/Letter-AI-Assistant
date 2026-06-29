import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize GoogleGenAI to prevent crash if key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not set in environment variables!");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Resilient helper to handle transient 503/high-demand errors with exponential backoff and fallback models
async function generateContentWithRetry(ai: any, params: any, maxRetries = 3) {
  let attempt = 0;
  let delay = 1000;

  while (true) {
    try {
      return await ai.models.generateContent(params);
    } catch (error: any) {
      attempt++;

      const isTransient = error.status === "UNAVAILABLE" ||
        error.code === 503 ||
        (error.message && (
          error.message.includes("503") ||
          error.message.includes("high demand") ||
          error.message.includes("UNAVAILABLE") ||
          error.message.includes("temporary") ||
          error.message.includes("overloaded")
        ));

      if (isTransient && attempt < maxRetries) {
        console.warn(`Gemini API transient error (attempt ${attempt}/${maxRetries}). Retrying in ${delay}ms...`, error.message || error);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }

      // If we exhausted retries or it's a transient 503 and we want a fallback model immediately
      if (params.model === "gemini-3.5-flash") {
        console.warn(`gemini-3.5-flash failed or experienced high demand. Falling back to gemini-flash-latest...`);
        try {
          return await ai.models.generateContent({
            ...params,
            model: "gemini-flash-latest",
          });
        } catch (fallbackError: any) {
          console.error("Fallback to gemini-flash-latest failed too:", fallbackError);
          console.warn("Falling back to gemini-3.1-flash-lite as last resort...");
          try {
            return await ai.models.generateContent({
              ...params,
              model: "gemini-3.1-flash-lite",
            });
          } catch (lastResortError) {
            throw error; // Throw the original error if fallback also fails
          }
        }
      }

      throw error;
    }
  }
}

// API routes go here FIRST
app.post("/api/analyze-requirements", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return a standard high quality response so that the application is fully interactive even without a key
      return res.json({
        suggestedTone: "Professional",
        questions: [
          { key: "recipientName", label: "Recipient Name / Title", placeholder: "e.g. Hiring Manager, HR Team", type: "text", required: true },
          { key: "senderName", label: "Your Name", placeholder: "e.g. Amit Sharma", type: "text", required: true },
          { key: "keyPoints", label: "Key Points to Include", placeholder: "e.g. Seeking formal leaves for sibling's wedding from Oct 5 to Oct 10", type: "textarea", required: true },
          { key: "urgency", label: "Additional Context / Urgency", placeholder: "e.g. High priority, keeping hand-off plan ready", type: "text", required: false }
        ]
      });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are an expert correspondence writer. Analyze the user's letter/email drafting request and suggest the 3 to 5 most important details (variables) we should ask the user to provide in order to generate a high-quality, professional letter or email.
Topic of letter: "${topic}"

Provide the response in the specified JSON schema format. Return keys that are relevant to this specific kind of letter (for example, for a resignation: senderName, recipientName, companyName, lastWorkingDay, keyReasons). Use clear, human-friendly labels and realistic placeholders. Include at least 3 questions. Ensure keys are in simple camelCase.`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedTone: { type: Type.STRING, description: "The recommended tone, e.g. Professional, Formal, Urgent, Friendly, Warm" },
            questions: {
              type: Type.ARRAY,
              description: "The set of questions/inputs needed from the user",
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING, description: "camelCase identifier, e.g. recipientName" },
                  label: { type: Type.STRING, description: "Display label for the input field" },
                  placeholder: { type: Type.STRING, description: "Helpful placeholder or example value" },
                  type: { type: Type.STRING, description: "Input type: either 'text' or 'textarea'" },
                  required: { type: Type.BOOLEAN, description: "Whether this input is required to draft the letter" }
                },
                required: ["key", "label", "placeholder", "type", "required"]
              }
            }
          },
          required: ["suggestedTone", "questions"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }
    const data = JSON.parse(resultText.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error analyzing requirements:", error);
    res.status(500).json({ error: error.message || "Failed to analyze requirements" });
  }
});

app.post("/api/generate-correspondence", async (req, res) => {
  try {
    const { topic, tone, answers } = req.body;
    if (!topic || !tone || !answers) {
      return res.status(400).json({ error: "Missing required parameters (topic, tone, answers)" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Mocked high quality response if no API key is set
      const sender = answers.senderName || "[Your Name]";
      const recipient = answers.recipientName || "[Recipient Name]";
      const notes = answers.keyPoints || answers.keyReasons || "[Key Points]";
      return res.json({
        english: `Subject: Regarding: ${topic}\n\nDear ${recipient},\n\nI am writing to you regarding ${topic}.\n\nSpecifically, I would like to bring the following to your attention:\n\n${notes}\n\nThank you for your time, support, and consideration. I look forward to your response.\n\nSincerely,\n\n${sender}`,
        hindi: `विषय: ${topic} के संबंध में\n\nप्रिय ${recipient},\n\nमैं आपको ${topic} के संबंध में यह पत्र लिख रहा हूँ।\n\nविशेष रूप से, मैं आपका ध्यान निम्नलिखित बिंदुओं की ओर आकर्षित करना चाहता हूँ:\n\n${notes}\n\nआपके समय, समर्थन और विचार के लिए धन्यवाद। मुझे आपकी प्रतिक्रिया का इंतज़ार रहेगा।\n\nसादर,\n\n${sender}`
      });
    }

    const ai = getGeminiClient();
    const systemPrompt = `You are a world-class professional copywriter and translator fluent in both English and Hindi.
Draft a highly polished, professional, and contextually appropriate letter or email based on the following instructions:

General Topic: "${topic}"
Desired Tone: "${tone}"
User-Provided Key Details:
${JSON.stringify(answers, null, 2)}

Requirements:
1. Generate the letter/email in English. Include standard professional structure: Subject line (if applicable), greeting, cohesive body paragraphs with appropriate transitions, and professional closing with sign-off placeholder.
2. Generate an equally high-quality adaptation in Hindi (Devanagari script). The Hindi version should NOT be a dry word-for-word translation; it must be written in natural, formal, polite, and culturally resonant Hindi (standard business/official Hindi) that reads as if it was originally composed by a native Hindi speaker.
3. Return the response strictly adhering to the JSON schema specified, with 'english' and 'hindi' fields containing the final text. Use standard newline characters '\\n' for paragraphs. Do not include markdown codeblocks inside the json fields.`;

    const response = await generateContentWithRetry(ai, {
      model: "gemini-3.5-flash",
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING, description: "The drafted letter/email in English with paragraph line breaks" },
            hindi: { type: Type.STRING, description: "The drafted letter/email in Hindi with paragraph line breaks" }
          },
          required: ["english", "hindi"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }
    const data = JSON.parse(resultText.trim());
    res.json(data);
  } catch (error: any) {
    console.error("Error generating correspondence:", error);
    res.status(500).json({ error: error.message || "Failed to generate correspondence" });
  }
});

// Vite middleware setup
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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
