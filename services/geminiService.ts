
import { GoogleGenAI, Type } from "@google/genai";
import { Script } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateScript = async (concept: string): Promise<Script> => {
  const model = "gemini-3-pro-preview";
  
  const prompt = `
    তুমি একজন মাস্টার লেভেলের চিত্রনাট্যকার। 'Paligram TV' বা 'Number One Gramin TV' এর জন্য একটি ৩-৪ পৃষ্ঠার (৮-১২টি দৃশ্য) প্রফেশনাল গ্রামীণ নাটক স্ক্রিপ্ট তৈরি করো।
    
    কনসেপ্ট: "${concept}"
    
    নির্দেশনা:
    ১. ভাষা: সম্পূর্ণ বাংলা। গ্রামীণ আঞ্চলিক শব্দ ব্যবহার করো যাতে নাটকটি জীবন্ত মনে হয়।
    ২. দৈর্ঘ্য: ৩-৪ পৃষ্ঠা। দৃশ্য সংখ্যা ৮-১২টি হতে হবে। কাহিনী ছোট কিন্তু অত্যন্ত আকর্ষণীয় এবং প্রো-লেভেলের হতে হবে।
    ৩. চরিত্র: 
       - সালাম (২০): চটপটে ও বুদ্ধিমান।
       - শাহাদাত (২০): গম্ভীর ও পরিশ্রমী।
       - তুষি (২০): সাহসী ও প্রতিবাদী।
       - তুষার (১০): ছোট বাচ্চা, তার সংলাপগুলো সব সময় খুব ছোট ছোট (যেমন: "কেন বাবা?", "আমি যাবো না", "ভাত দাও") হতে হবে।
    ৪. ফরম্যাট: দৃশ্য নম্বর, লোকেশন, সময়, বিস্তারিত অ্যাকশন, চরিত্রের সংলাপ (আবেগসহ), এবং এডিটিং নোট।
    ৫. চরিত্রের গভীরতা: সংলাপগুলো যেন স্বাভাবিক মনে হয়, রোবটিক নয়।
    
    আউটপুটটি শুধুমাত্র নিচের JSON ফরম্যাটে দাও:
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      thinkingConfig: { thinkingBudget: 8000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          writer: { type: Type.STRING },
          summary: { type: Type.STRING },
          characters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                age: { type: Type.NUMBER },
                description: { type: Type.STRING },
                costume: { type: Type.STRING }
              },
              required: ["name", "age", "description", "costume"]
            }
          },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.NUMBER },
                location: { type: Type.STRING },
                time: { type: Type.STRING },
                action: { type: Type.STRING },
                dialogues: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      character: { type: Type.STRING },
                      text: { type: Type.STRING },
                      parenthetical: { type: Type.STRING }
                    },
                    required: ["character", "text"]
                  }
                },
                editingNote: { type: Type.STRING }
              },
              required: ["sceneNumber", "location", "time", "action", "dialogues"]
            }
          }
        },
        required: ["title", "writer", "characters", "scenes", "summary"]
      }
    }
  });

  if (!response.text) throw new Error("No content generated");
  return JSON.parse(response.text);
};
