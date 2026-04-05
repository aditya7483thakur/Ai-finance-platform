import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_MODEL_NAME = "gemini-1.5-flash";

export const GEMINI_API_MISSING_ERROR = "GEMINI_API_MISSING";

export type FinancialTipExpenseItem = {
  name: string;
  value: number;
};

const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API;

  if (!apiKey || apiKey.trim() === "") {
    throw new Error(GEMINI_API_MISSING_ERROR);
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: GEMINI_MODEL_NAME });
};

export const generateFinancialTipWithGemini = async (
  expenses: FinancialTipExpenseItem[],
): Promise<string> => {
  const model = getGeminiModel();

  const prompt = `
You are a friendly financial advisor. Based on the category-wise monthly spending below, write 2-3 personalized financial tips. Be concise, friendly, and avoid guilt-tripping.

Here is the user's monthly spending:
${expenses.map((item) => `${item.name}: INR ${item.value.toFixed(2)}`).join("\n")}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

export const extractReceiptDataWithGemini = async (
  mimeType: string,
  base64Image: string,
): Promise<string> => {
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

  return result.response.text().trim();
};
