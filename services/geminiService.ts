
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis, AIDetectionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const analyzeText = async (text: string, retries = 3, backoff = 2000): Promise<AIAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following text and provide a detailed linguistic breakdown: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING, description: "Overall sentiment of the text (Positive, Negative, Neutral)." },
            complexity: { type: Type.STRING, description: "Reading complexity level." },
            summary: { type: Type.STRING, description: "A very brief one-sentence summary." },
            keywords: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Top 5 important keywords."
            },
            tone: { type: Type.STRING, description: "The tone of writing (Formal, Casual, Informative, etc.)" },
            partsOfSpeech: {
              type: Type.OBJECT,
              properties: {
                nouns: { type: Type.NUMBER },
                verbs: { type: Type.NUMBER },
                adjectives: { type: Type.NUMBER }
              },
              required: ["nouns", "verbs", "adjectives"]
            }
          },
          required: ["sentiment", "complexity", "summary", "keywords", "tone", "partsOfSpeech"],
        }
      }
    });

    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as AIAnalysis;
  } catch (error: any) {
    const isQuotaError = error?.message?.includes("429") || error?.message?.includes("QUOTA_EXHAUSTED") || error?.message?.includes("RESOURCE_EXHAUSTED");
    
    if (isQuotaError && retries > 0) {
      console.warn(`Quota exceeded. Retrying in ${backoff}ms... (${retries} retries left)`);
      await delay(backoff);
      return analyzeText(text, retries - 1, backoff * 2);
    }
    
    throw error;
  }
};

export const summarizeText = async (text: string, limit: number, retries = 3, backoff = 2000): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Ringkas teks berikut menjadi maksimal sekitar ${limit} karakter. Pastikan maksud dan nada aslinya tidak berubah: "${text}"`,
    });

    return response.text || "Gagal menghasilkan ringkasan.";
  } catch (error: any) {
    const isQuotaError = error?.message?.includes("429") || error?.message?.includes("QUOTA_EXHAUSTED") || error?.message?.includes("RESOURCE_EXHAUSTED");
    
    if (isQuotaError && retries > 0) {
      await delay(backoff);
      return summarizeText(text, limit, retries - 1, backoff * 2);
    }
    
    throw error;
  }
};

export const detectAI = async (text: string, retries = 3, backoff = 2000): Promise<AIDetectionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Bertindaklah sebagai detektor konten AI. Analisis teks berikut dan tentukan probabilitas apakah teks ini dibuat oleh AI atau manusia. Berikan hasil dalam JSON. Teks: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiProbability: { type: Type.NUMBER, description: "Probabilitas teks dibuat oleh AI (0-100)." },
            reasoning: { type: Type.STRING, description: "Alasan singkat mengapa teks ini dianggap AI atau Manusia." },
            isLikelyAI: { type: Type.BOOLEAN, description: "Benar jika probabilitas AI > 50%." }
          },
          required: ["aiProbability", "reasoning", "isLikelyAI"]
        }
      }
    });
    return JSON.parse(response.text.trim()) as AIDetectionResult;
  } catch (error: any) {
    const isQuotaError = error?.message?.includes("429") || error?.message?.includes("QUOTA_EXHAUSTED") || error?.message?.includes("RESOURCE_EXHAUSTED");
    if (isQuotaError && retries > 0) {
      await delay(backoff);
      return detectAI(text, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const humanizeText = async (text: string, retries = 3, backoff = 2000): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Ubah teks berikut agar terdengar lebih alami seperti ditulis oleh manusia. Tambahkan variasi struktur kalimat, kurangi repetisi pola AI yang kaku, tapi tetap pertahankan makna aslinya. Jangan gunakan gaya bahasa yang terlalu formal atau kaku jika aslinya santai. Teks: "${text}"`,
    });
    return response.text || text;
  } catch (error: any) {
    const isQuotaError = error?.message?.includes("429") || error?.message?.includes("QUOTA_EXHAUSTED") || error?.message?.includes("RESOURCE_EXHAUSTED");
    if (isQuotaError && retries > 0) {
      await delay(backoff);
      return humanizeText(text, retries - 1, backoff * 2);
    }
    throw error;
  }
};
