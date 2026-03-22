import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

export async function generateFinancialTip(expenses) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a friendly financial advisor. Based on the category-wise monthly spending below, write 2-3 personalized financial tips. Be concise, friendly, and avoid guilt-tripping.

Here is the user's monthly spending:
${expenses.map((item) => `${item.name}: ₹${item.value.toFixed(2)}`).join("\n")}
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
