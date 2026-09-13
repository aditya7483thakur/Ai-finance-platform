import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AiClient } from "./ai.port.js";
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

    const prompt = `
You are a friendly financial advisor. Based on the category-wise monthly spending below, write 2-3 personalized financial tips. Be concise, friendly, and avoid guilt-tripping.

Here is the user's monthly spending:
${expenses.map((item) => `${item.name}: INR ${item.value.toFixed(2)}`).join("\n")}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  },

  extractReceipt: async ({ mimeType, base64Image }) => {
    const model = getGeminiModel();

    const prompt = `
You're a smart assistant that extracts fields from receipts.
From the uploaded image, return this object:
{
  "type": "INCOME" or "EXPENSE",
  "amount": "number as string",
  "category": "One of: SALARY, INVESTMENTS, FOOD, TRANSPORT, HOUSING, ENTERTAINMENT, TRAVEL, HEALTH, SHOPPING, MISCELLANEOUS",
  "date": "yyyy-mm-dd",
  "description": "short merchant or transaction description"
}
If it's not a receipt, return an empty object {}
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
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
