import type { VercelRequest, VercelResponse } from "@vercel/node";
import { analyzeRequirements } from "../lib/gemini";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { topic } = req.body || {};
    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const data = await analyzeRequirements(topic);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Error analyzing requirements:", error);
    return res.status(500).json({ error: error.message || "Failed to analyze requirements" });
  }
}
