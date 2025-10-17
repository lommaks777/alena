const MODEL = 'gpt-4o-mini';

function determineStage(answers = {}) {
    const counts = { A: 0, B: 0, C: 0, D: 0 };

    Object.entries(answers).forEach(([questionId, answer]) => {
        if (questionId === 'q0') {
            return;
        }

        if (counts.hasOwnProperty(answer)) {
            counts[answer] += 1;
        }
    });

    const max = Math.max(...Object.values(counts));
    if (!max) {
        return 'A';
    }

    return Object.keys(counts).find((key) => counts[key] === max) || 'A';
}

const fallbackContent = {
    A: {
        title: '✈️ Стадия 1. Туристка — «Пока всё ново и интересно»',
        now: 'Сейчас вокруг много новизны, и ты словно собираешь пазл из впечатлений. Восторг соседствует с лёгким напряжением — хочется всё успеть и ничего не упустить.',
        focus: 'Важно бережно распределять энергию и дать себе время переварить изменения. Опора в базовых ритуалах и знакомых действиях помогает проживать адаптацию мягко.',
        timeline: {
            7: 'Заметь маленькие победы каждого дня и отметь их, чтобы укрепить чувство «я справляюсь».',
            14: 'Добавь один новый устойчивый ритуал — утреннюю прогулку, разговор с близкой подругой или мини-план недели.',
            30: 'Создай карту ресурса: люди, места и дела, которые быстро возвращают тебе ощущение спокойствия и любопытства.'
        },
        firstStep: 'Выбери одно действие, которое вернёт телу ощущение безопасности: тёплый душ, любимый плейлист или тихое утро без новостей.',
        recommendation: 'Бережно сокращай поток новизны. Заранее планируй день, оставляя окна для отдыха и спонтанности.',
        bonus: 'Попробуй вести дневник открытий, куда запишешь три самых тёплых момента недели и чему они тебя научили.'
    },
    B: {
        title: '🌊 Стадия 2. Погружение — «Всё идёт, но не так легко»',
        now: 'Ты уже разобралась с основами и теперь сталкиваешься с глубиной процесса. Иногда кажется, что окружающий мир не откликается так быстро, как хотелось бы, и нужно больше внутренней поддержки.',
        focus: 'Сейчас важно нормализовать эмоции и разрешить себе просить помощи. Осознанные связи и мягкая дисциплина помогут почувствовать устойчивость.',
        timeline: {
            7: 'Назови чувство, которое приходит чаще всего, и найди для него безопасный выход — разговор, творчество или движение.',
            14: 'Добавь регулярную встречу с человеком, рядом с которым можно быть собой, и делись реальными переживаниями.',
            30: 'Пересмотри дневной распорядок: что даёт энергию, а что забирает. Внеси одну корректировку, чтобы стать ближе к желаемому состоянию.'
        },
        firstStep: 'Запланируй разговор с человеком, который умеет слушать. Поделись, что тебе сейчас нужно от поддержки.',
        recommendation: 'Веди список «что мне помогает». Отмечай практики, от которых появляется ощущение опоры, и возвращайся к нему, когда настроение проседает.',
        bonus: 'Сделай для себя «коробку заботы»: несколько предметов, которые быстро возвращают тепло — любимая книга, аромат, плейлист или фото.'
    },
    C: {
        title: '🌑 Стадия 3. Усталость — «Живу, но не чувствую себя живой»',
        now: 'Ты много делаешь и держишься из последних сил. Режим уже налажен, но внутри накапливается усталость, и хочется вернуть ощущение смысла и лёгкости.',
        focus: 'Сейчас ключ — в восстановлении ресурса и постепенном возвращении интереса к себе. Маленькие шаги и телесные практики помогут снова почувствовать вкус к жизни.',
        timeline: {
            7: 'Отметь один источник напряжения и придумай, как снять его хотя бы на 10%. Это может быть делегирование, пауза или честный «нет».',
            14: 'Запланируй две «точки радости» в неделю: встречу, занятие или место, откуда ты выходишь легче.',
            30: 'Посмотри на свои цели в новой стране и выдели одну, которая действительно откликается. Продумай мягкий план её достижения.'
        },
        firstStep: 'Сделай дыхательную или расслабляющую практику прямо сегодня и отметь, как меняется состояние тела.',
        recommendation: 'Ставь будильник на короткие паузы. В эти моменты возвращай себе внимание — через растяжку, воду или запись мыслей.',
        bonus: 'Собери «лист вдохновения»: цитаты, воспоминания и мечты, которые напоминают, зачем ты начала этот путь.'
    },
    D: {
        title: '🌅 Стадия 4. Новая версия себя — «Живу, но хочу большего смысла и лёгкости»',
        now: 'Ты уже создала устойчивый быт и связи. Теперь хочется углубиться и собрать новую версию себя, где есть и результаты, и удовольствие от процесса.',
        focus: 'Важно перевести внимание с привычного «надо» на «хочу» и смело расширять горизонты. Поддерживай себя в экспериментах и празднуй прогресс.',
        timeline: {
            7: 'Выбери один проект, который давно откладываешь, и зафиксируй первый конкретный шаг.',
            14: 'Внеси в календарь личный ритуал празднования — встречу, прогулку или вечер для себя.',
            30: 'Создай видение на полгода: чего хочется в карьере, отношениях и ощущении от жизни. Подчеркни, что приносит радость.'
        },
        firstStep: 'Напиши себе письмо из будущего — каким ты видишь свой день, когда стало легче и свободнее.',
        recommendation: 'Регулярно оценивай баланс между делами «для других» и «для себя». Смещай фокус в сторону того, что зажигает.',
        bonus: 'Собери «панель вдохновения»: фотографии, слова и символы, которые держат курс на твою обновлённую версию.'
    }
};

function escapeHtml(value = '') {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function buildHighlights(answers = {}, questionTexts = {}, answerTexts = {}) {
    return Object.entries(answers)
        .filter(([questionId]) => questionId !== 'q0')
        .map(([questionId, answer]) => {
            const question = questionTexts[questionId] || questionId;
            const answerLabel = answerTexts[questionId]?.[answer] || answer;
            return `${escapeHtml(question)} — <strong>${escapeHtml(answerLabel)}</strong>`;
        })
        .slice(0, 4);
}

function buildFallbackResult({ name = '', answers = {}, questionTexts = {}, answerTexts = {} }) {
    const stage = determineStage(answers);
    const content = fallbackContent[stage] || fallbackContent.A;
    const safeName = escapeHtml(name.trim() || 'Гость');
    const stageTitle = escapeHtml(content.title);
    const highlights = buildHighlights(answers, questionTexts, answerTexts);
    const highlightsHtml = highlights.length
        ? `<p>Твои ответы подсказали, куда смотреть внимательнее:</p><ul>${highlights.map((item) => `<li>${item}</li>`).join('')}</ul>`
        : '';

    return `
<h2 class="section-title">Где ты сейчас</h2>
<p><strong>${stageTitle}</strong></p>
<p>${safeName}, ${escapeHtml(content.now)}</p>
<h2 class="section-title">Что сейчас важно</h2>
<p>${escapeHtml(content.focus)}</p>
${highlightsHtml}
<h2 class="section-title">Первый, самый бережный шаг</h2>
<p>${escapeHtml(content.firstStep)}</p>
<h2 class="section-title">Моя рекомендация для тебя</h2>
<p>${escapeHtml(content.recommendation)}</p>
<h2 class="section-title">Маленький бонус для настроения</h2>
<p>${escapeHtml(content.bonus)}</p>
<h2 class="section-title">Что дальше? Давай поговорим</h2>
<p>${safeName}, ${escapeHtml(content.nextSteps || 'эти рекомендации — первый шаг. На нашей бесплатной дружеской встрече мы сможем вместе составить твой личный, пошаговый план. Это просто тёплый разговор, который поможет тебе найти ясность. Заполни форму ниже, и давай созвонимся!')}</p>
`;
}

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

        const prompt = `Ты — Алена, профессиональный и эмпатичный коуч, который помогает женщинам в эмиграции находить стабильность и переходить от застоя к мягкому движению. Твой тон тёплый, поддерживающий, как разговор с близкой подругой за чашкой кофе.

Главная цель:
Не просто выдать результат квиза, а построить доверие и желание записаться на бесплатную консультацию, чтобы получить персональный план.

Строгие требования:
1. Обращайся по имени: Всегда используй имя человека (${safeName})
2. Структура: Следуй строго семиблочному формату с точными CSS-классами
3. Персонализация: Мягко ссылайся на ответы пользователя
4. HTML-формат: Возвращай чистый HTML (h2, h3, p, ul, li, strong, em)
5. Уместные эмодзи: Добавляй теплоты, но не перегружай
6. Конверсионный фокус: Финальный блок должен содержать тёплый призыв к действию
7. Компактность: Короткие абзацы для лёгкого чтения

Шестиблочная структура:

Блок 1: <h2 class="section-title">Где ты сейчас</h2>
(Где ты сейчас)

Блок 2: <h2 class="section-title">Что сейчас важно</h2>
(Что важно сейчас)

Блок 3: <h2 class="section-title">Первый, самый бережный шаг</h2>
(Первый, самый бережный шаг)

Блок 4: <h2 class="section-title">Моя рекомендация для тебя</h2>
(Моя рекомендация для тебя)

Блок 5: <h2 class="section-title">Маленький бонус для настроения</h2>
(Маленький бонус для настроения)

Блок 6: <h2 class="section-title">Что дальше? Давай поговорим</h2>
(Что дальше? Давай поговорим - конверсионный блок)

ВАЖНО: Верни ТОЛЬКО чистый HTML без markdown-тегов. НЕ используй тройные кавычки для оборачивания кода. Начинай сразу с <h2> тега.

Пример текста конверсионного блока:
"${safeName}, эти рекомендации — первый шаг. На нашей бесплатной дружеской встрече мы сможем вместе составить твой личный, пошаговый план. Это просто тёплый разговор, который поможет тебе найти ясность. Заполни форму ниже, и давай созвонимся!"

Обязательно подчеркни: Бесплатно и без обязательств.

Ответы пользователя:
${formattedAnswers || 'Ответы не заполнены'}
`;

        if (!process.env.OPENAI_API_KEY) {
            const fallbackResult = buildFallbackResult({ name, answers, questionTexts, answerTexts });
            res.status(200).json({ result: fallbackResult });
            return;
        }

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
                        content: 'Ты эмпатичный коуч Алена, которая помогает женщинам в эмиграции. Пиши структурированно, с лёгкими эмодзи и вдохновляющими формулировками, но без клише. Твой тон — тёплый, как разговор с близкой подругой за чашкой кофе.'
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
            const fallbackResult = buildFallbackResult({ name, answers, questionTexts, answerTexts });
            res.status(200).json({ result: fallbackResult, warning: 'fallback' });
            return;
        }

        const data = await openaiResponse.json();
        let result = data?.choices?.[0]?.message?.content?.trim();

        if (!result) {
            const fallbackResult = buildFallbackResult({ name, answers, questionTexts, answerTexts });
            res.status(200).json({ result: fallbackResult, warning: 'empty' });
            return;
        }

        // Удаляем markdown-теги если они есть
        result = result.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');

        res.status(200).json({ result });
    } catch (error) {
        console.error('Error generating result:', error);
        let fallbackPayload = {};
        try {
            fallbackPayload = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
        } catch (parseError) {
            console.error('Failed to parse request body for fallback:', parseError);
        }

        const { name = '', answers = {}, questionTexts = {}, answerTexts = {} } = fallbackPayload;
        const fallbackResult = buildFallbackResult({ name, answers, questionTexts, answerTexts });
        res.status(200).json({ result: fallbackResult, warning: 'exception' });
    }
}