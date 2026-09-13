import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiClient } from "./ai.port.js";
import { buildReceiptPrompt, buildTipsPrompt } from "./ai.prompts.js";
import { AI_API_MISSING_ERROR, type AiReceiptResult } from "./ai.types.js";

const parseReceiptJson = (rawText: string): AiReceiptResult => {
  const cleanText = rawText.replace(/```(json)?/g, "").trim();
  return JSON.parse(cleanText) as AiReceiptResult;
};

const GEMINI_MODEL_NAME = "gemini-1.5-flash";

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(AI_API_MISSING_ERROR);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
};

export const aiGeminiAdapter: AiClient = {
  writeTips: async (expenses) => {
    const model = getGeminiModel();
    const result = await model.generateContent(buildTipsPrompt(expenses));
    const response = await result.response;
    return response.text();
  },

  extractReceipt: async ({ mimeType, base64Image }) => {
    const model = getGeminiModel();

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: buildReceiptPrompt() },
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    return parseReceiptJson(result.response.text());
  },
};
