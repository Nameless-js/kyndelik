import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

const groqClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
  try {
    const { profile, courses, opportunities } = await req.json();

    const prompt = `Ты персональный AI-ассистент Mentoria Hub. 
Профиль ученика: Имя: ${profile.name}, Класс: ${profile.grade}, Интересы: ${profile.interests.join(", ")}, Цели: ${profile.goals}.
Доступные курсы: ${courses.map((c: any) => c.title).join(", ")}.
Доступные возможности: ${opportunities.map((o: any) => o.title).join(", ")}.
Твоя задача: Напиши ОЧЕНЬ короткое (2-3 предложения), мотивирующее сообщение для ученика. Посоветуй 1 конкретный курс и 1 конкретную возможность из списка, которые лучше всего подходят под его интересы. Обращайся к нему на "ты" по имени. Отформатируй ключевые названия **жирным** шрифтом. Никаких приветствий, сразу к делу.`;

    try {
      // Use Groq API with Llama 3
      const response = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
      });
      return NextResponse.json({ recommendation: response.choices[0].message.content, model: "llama-3.3" });
    } catch (apiError: any) {
      console.error("Groq API failed:", apiError.message);
      throw apiError;
    }
  } catch (error) {
    console.error("AI Assistant Error:", error);
    return NextResponse.json(
      { recommendation: "Кажется, я немного устал. Но не волнуйся, выбери любой курс из каталога и начни развиваться уже сегодня!" },
      { status: 500 }
    );
  }
}
