import type { VercelRequest, VercelResponse } from "@vercel/node";
import { generateCorrespondence } from "../lib/gemini.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic, tone, answers } = req.body || {};
    if (!topic || !tone || !answers) {
      return res.status(400).json({ error: "Missing required parameters (topic, tone, answers)" });
    }

    const data = await generateCorrespondence(topic, tone, answers);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error generating correspondence:", error);
    return res.status(500).json({ error: error.message || "Failed to generate correspondence" });
  }
}
