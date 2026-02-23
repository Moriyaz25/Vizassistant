import OpenAI from "openai";
import { fetchDataWithRetry } from '../utils/fetchWithRetry'

const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || "llama-3.3-70b-versatile";

const openai = GROQ_KEY ? new OpenAI({
    apiKey: GROQ_KEY,
    baseURL: "https://api.groq.com/openai/v1",
    fetch: fetchDataWithRetry,
    dangerouslyAllowBrowser: true // Required for client-side usage in Vite
}) : null;

/**
 * Generates insights from the provided dataset using OpenAI.
 * @param {Array} data - The dataset to analyze (JSON array).
 * @returns {Promise<string>} - The generated insights in markdown format.
 */
export const generateInsights = async (data) => {
    if (!openai) {
        return "AI_UNAVAILABLE: Please set a valid VITE_GROQ_API_KEY in your settings to enable insights.";
    }

    if (!data || data.length === 0) {
        return "No data available to analyze.";
    }

    const previewData = data.slice(0, 100);
    const prompt = `
    Context: You are a professional data analyst.
    Task: Analyze the provided dataset and generate a concise summary with 3-5 key actionable insights.
    Focus on:
    - Significant trends or patterns
    - Anomalies or outliers
    - Potential opportunities or risks based on the numbers
    
    Data (JSON format):
    ${JSON.stringify(previewData)}
    
    Format of Output: 
    Return ONLY clean Markdown. Start with a brief overview paragraph, followed by a bulleted list of insights. Use bold text for emphasis.
  `;

    try {
        const completion = await openai.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
                { role: "system", content: "You are a professional data analyst." },
                { role: "user", content: prompt }
            ]
        });

        return completion.choices[0].message.content;
    } catch (error) {
        if (error.status === 429) {
            return "QUOTA_EXCEEDED: Groq quota reached. Please check your usage or try again later.";
        }
        console.error("Error generating insights:", error);
        return `ERROR: ${error.message || "Failed to generate AI insights."}`;
    }
};

/**
 * Answers a user query based on the provided dataset context using OpenAI.
 * @param {string} query - The user's question.
 * @param {Array} contextData - The dataset context.
 * @returns {Promise<string>} - The answer.
 */
export const askAI = async (query, contextData) => {
    if (!openai) {
        return "AI_UNAVAILABLE: Please set a valid VITE_GROQ_API_KEY in your settings to ask questions.";
    }

    if (!query) return "Please ask a question.";

    const contextPreview = contextData ? JSON.stringify(contextData.slice(0, 50)) : "No specific data loaded.";

    const prompt = `
        You are a helpful data analyst assistant for the "Vizasistance" platform.
        Context Data (preview of first 50 rows): ${contextPreview}
        
        User Question: ${query}
        
        Guidelines:
        - If the question can be answered from the data, provide a clear and accurate calculation or description.
        - If the question is about trends, describe them based on the provided JSON.
        - If you cannot answer based on the data, politely say so.
        - Keep the answer concise (maximum 3-4 sentences).
        - Use Markdown for numbers or lists if appropriate.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: GROQ_MODEL,
            messages: [
                { role: "system", content: "You are a helpful data analyst assistant." },
                { role: "user", content: prompt }
            ]
        });

        return completion.choices[0].message.content;
    } catch (error) {
        if (error.status === 429) {
            return "QUOTA_EXCEEDED: Groq quota reached. Please check your usage.";
        }
        console.error("Error asking AI:", error);
        return `ERROR: ${error.message || "I encountered an error trying to process your request."}`;
    }
}
