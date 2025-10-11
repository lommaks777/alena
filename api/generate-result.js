const MODEL = 'gpt-4o-mini';

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method not allowed' });
        return;
    }

    if (!process.env.OPENAI_API_KEY) {
        res.status(500).json({ message: 'OPENAI_API_KEY is not configured' });
        return;
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        const { name = '', answers = {}, questionTexts = {}, answerTexts = {} } = body;

        const formattedAnswers = Object.entries(answers)
            .filter(([key]) => key !== 'q0')
            .map(([key, value]) => {
                const questionLabel = questionTexts[key] || key;
                const answerLabel = (answerTexts[key] && answerTexts[key][value]) || value;
                return `${questionLabel}\nОтвет: ${answerLabel}`;
            })
            .join('\n\n');

        const safeName = name.trim() || 'Гость';

        const prompt = `Ты профессиональный коуч и маркетолог Алена, который помогает женщинам в эмиграции мягко переходить из застоя в движение. Используй тёплый, поддерживающий тон, уважай личные границы, говори ободряюще.

Строго следуй требованиям:
1. Обращайся к человеку по имени (${safeName}).
2. Соблюдай структуру из шести блоков. Каждый блок оформляй заголовком h2 в точной формулировке и порядке:
   <h2>Где вы сейчас</h2>
   <h2>Что сейчас важно</h2>
   <h2>Через 7/14/30 дней</h2>
   <h2>Первый шаг</h2>
   <h2>Рекомендация</h2>
   <h2>Бонус</h2>
3. В блоке "Через 7/14/30 дней" добавь три подзаголовка h3 с формулировками "Через 7 дней", "Через 14 дней", "Через 30 дней" и коротко опиши каждый горизонт.
4. Верни только чистый HTML-код без обёрток <html> или ```html```. Используй теги h2, h3, p, ul, li, strong, em. Добавляй уместные эмодзи, но не перегружай текст.
5. Не добавляй призыв к действию или упоминание бонусов, если об этом прямо не сказано. Давай персональные наблюдения и мягкие рекомендации.
6. Пиши компактные абзацы и избегай лишних пустых строк, чтобы текст выглядел аккуратно.

Ответы человека:
${formattedAnswers || 'Ответы не заполнены'}
`;

        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'Ты эмпатичный коуч и маркетолог, который помогает женщинам в эмиграции. Пиши структурировано, с лёгкими эмодзи и вдохновляющими формулировками, но без клише.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 800,
            }),
        });

        if (!openaiResponse.ok) {
            const errorText = await openaiResponse.text();
            console.error('OpenAI API error:', errorText);
            res.status(500).json({ message: 'Не удалось сгенерировать результат', details: errorText });
            return;
        }

        const data = await openaiResponse.json();
        const result = data?.choices?.[0]?.message?.content?.trim();

        if (!result) {
            res.status(500).json({ message: 'Не удалось получить текст ответа' });
            return;
        }

        res.status(200).json({ result });
    } catch (error) {
        console.error('Error generating result:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

