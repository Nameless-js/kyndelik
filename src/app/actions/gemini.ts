"use server";

const apiKey = process.env.GROK_API_KEY;

export async function generatePersonalCase(topic: string, interests: string[]) {
  try {
    if (!apiKey) {
      return { success: false, error: "API ключ Grok (X.AI) не настроен в .env.local" };
    }

    const interestsStr = interests.length > 0 
      ? interests.join(", ") 
      : "Общее развитие и самообразование";
    
    const prompt = `Ты - креативный ИИ-ментор образовательной платформы Mentoria Hub. 
Твоя задача: придумать 1 короткую и интересную практическую задачу (кейс) для ученика.
Название темы урока: "${topic}".
Ученик увлекается следующими направлениями: ${interestsStr}.

Кейс должен ОБЯЗАТЕЛЬНО объединять название темы урока и интересы ученика. Если название темы слишком короткое или непонятное, просто придумай задачу, отталкиваясь от названия.

Например: Если тема урока "Маркетинг", а интерес "Геймдев", задача: "Рассчитай бюджет на продвижение инди-игры в Steam".

Ограничения:
1. Ответь сразу текстом кейса (максимум 3-4 предложения).
2. Пиши вдохновляюще, обращаясь на "ты".`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Ты креативный преподаватель. Отвечай кратко, без предисловий, сразу выдавай текст задачи." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Ошибка API (статус ${response.status}): ${errorData}`);
    }

    const data = await response.json();
    return { success: true, text: data.choices[0].message.content };
  } catch (error: any) {
    console.error("Grok Error:", error);
    return { success: false, error: error.message || "Не удалось сгенерировать кейс" };
  }
}
