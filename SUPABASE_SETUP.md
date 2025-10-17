# 🚀 Supabase Integration Setup

## ✅ Что уже сделано

1. ✅ Установлен пакет `@supabase/supabase-js`
2. ✅ Обновлен `api/submit.js` для сохранения данных в Supabase
3. ✅ Обновлен `api/stats.js` для получения статистики из Supabase

---

## 📋 Что нужно сделать

### 1. Создайте таблицу в Supabase

Зайдите в **Supabase Dashboard** → Ваш проект → **SQL Editor** и выполните:

```sql
-- Создаем таблицу для ответов квиза
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT,
  result TEXT CHECK (result IN ('A', 'B', 'C', 'D')),
  answers JSONB NOT NULL,
  concern TEXT
);

-- Создаем индексы для быстрого поиска
CREATE INDEX idx_quiz_responses_created_at ON quiz_responses(created_at DESC);
CREATE INDEX idx_quiz_responses_result ON quiz_responses(result);

-- Включаем Row Level Security
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Политики доступа: разрешить всем читать и писать
CREATE POLICY "Enable read access for all users" ON quiz_responses
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON quiz_responses
  FOR INSERT WITH CHECK (true);
```

### 2. Добавьте переменные окружения в Vercel

1. Перейдите в **Vercel Dashboard** → проект `alena` → **Settings** → **Environment Variables**

2. Добавьте следующие переменные:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://xxxxxxxxxxxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | `eyJhbGc...` (ваш anon/public ключ) |

3. Убедитесь, что выбрали **все окружения**: Production, Preview, Development

4. Нажмите **Save**

### 3. Redeploy проект

После добавления переменных окружения:

```bash
# Опция 1: Через Git (рекомендуется)
git add .
git commit -m "feat: integrate Supabase for persistent storage"
git push origin feature/server-data-storage

# Опция 2: Вручную через Vercel Dashboard
# Перейдите в Deployments → Redeploy
```

---

## 🔍 Как проверить, что всё работает

### Проверка API submit

```bash
curl -X POST https://your-domain.vercel.app/api/submit \
  -H "Content-Type: application/json" \
  -d '{
    "answers": {
      "q0": "Test User",
      "q1": "A",
      "q2": "B",
      "q10": "Test concern"
    },
    "result": "A"
  }'
```

Ожидаемый ответ:
```json
{
  "message": "Answers submitted successfully",
  "data": { ... }
}
```

### Проверка API stats

```bash
curl https://your-domain.vercel.app/api/stats
```

Ожидаемый ответ:
```json
{
  "totalResponses": 1,
  "resultsDistribution": { "A": 1 },
  "answersDistribution": { ... },
  "recentResponses": [ ... ]
}
```

### Проверка в Supabase Dashboard

1. Зайдите в **Table Editor** → `quiz_responses`
2. Вы должны увидеть новые записи после прохождения квиза

---

## 📊 Структура данных в Supabase

### Таблица `quiz_responses`

| Колонка | Тип | Описание |
|---------|-----|----------|
| `id` | UUID | Уникальный ID (генерируется автоматически) |
| `created_at` | TIMESTAMP | Дата и время прохождения квиза |
| `name` | TEXT | Имя пользователя (из q0) |
| `result` | TEXT | Результат квиза (A/B/C/D) |
| `answers` | JSONB | Все ответы пользователя в формате JSON |
| `concern` | TEXT | Ответ на вопрос "Что беспокоит" (q10) |

### Пример данных в `answers` (JSONB)

```json
{
  "q0": "Алена",
  "q1": "B",
  "q2": "C",
  "q3": "A",
  "q4": "B",
  "q5": "C",
  "q6": "D",
  "q7": "A",
  "q10": "Беспокоит адаптация и поиск работы"
}
```

---

## 🎯 Преимущества новой реализации

✅ **Постоянное хранение** - данные сохраняются навсегда
✅ **Быстрый доступ** - индексы для быстрых запросов
✅ **Масштабируемость** - Supabase справится с большим количеством пользователей
✅ **Безопасность** - Row Level Security для контроля доступа
✅ **Бесплатно** - до 500 МБ базы данных и 2 ГБ хранилища

---

## 🐛 Troubleshooting

### Ошибка: "Supabase credentials not found"

**Решение**: Проверьте, что переменные окружения добавлены в Vercel и проект заново задеплоен.

### Ошибка: "relation 'quiz_responses' does not exist"

**Решение**: Выполните SQL скрипт создания таблицы в Supabase SQL Editor.

### Данные не сохраняются

**Решение**: 
1. Проверьте логи в Vercel Dashboard → Deployments → Functions
2. Убедитесь, что Row Level Security настроен корректно
3. Проверьте, что CORS заголовки настроены правильно

---

## 📞 Поддержка

Если возникли проблемы, проверьте:
1. Vercel Dashboard → Functions → Logs
2. Supabase Dashboard → Logs
3. Browser Console (F12) для клиентских ошибок
