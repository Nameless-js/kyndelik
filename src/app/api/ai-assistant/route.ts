import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const grokClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { profile, courses, opportunities } = await req.json();

    const prompt = `Ты персональный AI-ассистент Mentoria Hub. 
Профиль ученика: Имя: ${profile.name}, Класс: ${profile.grade}, Интересы: ${profile.interests.join(", ")}, Цели: ${profile.goals}.
Доступные курсы: ${courses.map((c: any) => c.title).join(", ")}.
Доступные возможности: ${opportunities.map((o: any) => o.title).join(", ")}.
Твоя задача: Напиши ОЧЕНЬ короткое (2-3 предложения), мотивирующее сообщение для ученика. Посоветуй 1 конкретный курс и 1 конкретную возможность из списка, которые лучше всего подходят под его интересы. Обращайся к нему на "ты" по имени. Отформатируй ключевые названия **жирным** шрифтом. Никаких приветствий, сразу к делу.`;

    try {
      // Пытаемся использовать Grok
      const response = await grokClient.chat.completions.create({
        model: "grok-beta", // ИЛИ grok-2-latest (зависит от доступа ключа)
        messages: [{ role: "user", content: prompt }],
      });
      return NextResponse.json({ recommendation: response.choices[0].message.content, model: "grok" });
    } catch (grokError) {
      console.error("Grok failed, falling back to Gemini", grokError);
      
      // Fallback на Gemini
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;
      return NextResponse.json({ recommendation: response.text(), model: "gemini" });
    }
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json(
      { recommendation: "Кажется, я немного устал. Но не волнуйся, выбери любой курс из каталога и начни развиваться уже сегодня!" },
      { status: 500 }
    );
  }
}
