# 📊 Хранение данных квиза

## Где хранятся данные

### 1. **Supabase (основное хранилище)**
- **Таблица**: `quiz_responses`
- **Формат**: PostgreSQL база данных
- **Структура записи**:
```sql
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  result TEXT,
  answers JSONB,
  concern TEXT,
  is_partial BOOLEAN DEFAULT false,
  current_question INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Пример записи**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Имя пользователя",
  "result": "A",
  "answers": {
    "q0": "Имя пользователя",
    "q1": "A",
    "q2": "B",
    ...
  },
  "concern": "Текст опасений",
  "is_partial": false,
  "current_question": null,
  "created_at": "2025-10-04T01:12:16.828Z",
  "updated_at": "2025-10-04T01:12:16.828Z"
}
```

### 2. **Клиентское хранилище (резервное)**
- **Место**: `localStorage` браузера
- **Ключ**: `quizStats`
- **Назначение**: Локальная статистика и кэширование

## Автосохранение ответов

### Как это работает

1. **После каждого ответа** на вопрос данные автоматически сохраняются в Supabase
2. **Первое сохранение** создает новую запись с `is_partial = true`
3. **Последующие обновления** обновляют ту же запись по `sessionId`
4. **При завершении квиза** финальное сохранение устанавливает `is_partial = false` и добавляет результат

### Преимущества

✅ **Нет потери данных**: Даже если пользователь закроет страницу, его частичные ответы сохранены
✅ **Аналитика отказов**: Можно видеть, на каком вопросе пользователи чаще всего бросают квиз
✅ **Восстановление сессии**: Потенциально можно восстановить прогресс пользователя

### Поля для частичных сохранений

- `is_partial`: `true` для незавершенных квизов, `false` для завершенных
- `current_question`: Номер вопроса, на котором остановился пользователь
- `updated_at`: Время последнего обновления (для отслеживания активности)

## API Endpoints

### POST `/api/submit`
Сохраняет результаты квиза в Supabase (поддерживает частичные и полные сохранения)

**Запрос (частичное сохранение)**:
```json
{
  "answers": {
    "q0": "Имя",
    "q1": "A",
    "q2": "B"
  },
  "result": null,
  "isPartial": true,
  "currentQuestion": 2
}
```

**Запрос (финальное сохранение)**:
```json
{
  "answers": {
    "q0": "Имя",
    "q1": "A",
    ...
  },
  "result": "A",
  "isPartial": false,
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Ответ**:
```json
{
  "message": "Partial answers saved" // или "Answers submitted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Имя",
    "answers": {...},
    "result": "A",
    "is_partial": false,
    "created_at": "2025-10-04T01:12:16.828Z",
    "updated_at": "2025-10-04T01:15:23.456Z"
  },
  "sessionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### GET `/api/stats`
Возвращает агрегированную статистику из Supabase

**Параметры**:
- `includePartial` (optional): Включить частично заполненные квизы в статистику

**Ответ**:
```json
{
  "totalResponses": 42,
  "completedResponses": 38,
  "partialResponses": 4,
  "resultsDistribution": {
    "A": 10,
    "B": 15,
    "C": 12,
    "D": 5
  },
  "abandonnmentByQuestion": {
    "q1": 1,
    "q3": 2,
    "q5": 1
  },
  "answersDistribution": {
    "q1": {
      "A": 10,
      "B": 15,
      "C": 12,
      "D": 5
    },
    ...
  }
}
```

## Просмотр статистики

### Веб-интерфейс
Откройте `stats.html` в браузере для просмотра:
- Общее количество прохождений (полных и частичных)
- Распределение по результатам
- Статистика по каждому вопросу
- Детальные ответы пользователей
- **Новое**: Анализ отказов (на каких вопросах пользователи останавливаются)

### Прямой доступ к базе данных
Используйте Supabase Dashboard или SQL запросы:

```sql
-- Все завершенные квизы
SELECT * FROM quiz_responses WHERE is_partial = false;

-- Все незавершенные квизы
SELECT * FROM quiz_responses WHERE is_partial = true;

-- Статистика по отказам
SELECT current_question, COUNT(*) as abandonments
FROM quiz_responses
WHERE is_partial = true
GROUP BY current_question
ORDER BY abandonments DESC;
```

## Backup и управление данными

### Создание резервной копии (через Supabase)
```sql
-- Экспорт в CSV
COPY quiz_responses TO '/path/to/backup.csv' WITH CSV HEADER;
```

Или через Supabase Dashboard: Table Editor → Export to CSV

### Очистка данных
```sql
-- Удалить все частичные ответы старше 7 дней
DELETE FROM quiz_responses 
WHERE is_partial = true 
AND updated_at < NOW() - INTERVAL '7 days';

-- Удалить все данные (осторожно!)
DELETE FROM quiz_responses;
```

## Безопасность

⚠️ **Важно**: 
- База данных содержит персональные данные (имена, контакты, опасения)
- Используйте Row Level Security (RLS) в Supabase
- Убедитесь, что доступ к статистике защищен аутентификацией
- Регулярно проверяйте логи доступа

### Настройка RLS в Supabase
```sql
-- Включить RLS
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Разрешить вставку всем (для квиза)
CREATE POLICY "Allow insert for everyone" ON quiz_responses
FOR INSERT WITH CHECK (true);

-- Разрешить чтение только аутентифицированным пользователям
CREATE POLICY "Allow read for authenticated users" ON quiz_responses
FOR SELECT USING (auth.role() = 'authenticated');
```

## Миграция данных

### Применение миграции для частичных сохранений

Выполните SQL миграцию из файла `migrations/add_partial_fields.sql`:

```bash
# Через Supabase CLI
supabase db push

# Или через SQL Editor в Supabase Dashboard
```

Миграция добавит следующие поля:
- `is_partial` - флаг незавершенного квиза
- `current_question` - номер вопроса, где остановился
- `updated_at` - время последнего обновления

### Экспорт данных

```javascript
// Экспорт из Supabase в JSON
const { data, error } = await supabase
  .from('quiz_responses')
  .select('*')
  .eq('is_partial', false); // Только завершенные

// Сохранить в файл
fs.writeFileSync('export.json', JSON.stringify(data, null, 2));
```

## Аналитика

Для анализа данных можно использовать:

1. **Supabase Dashboard**: Встроенный SQL редактор для запросов

2. **Python с Supabase**:
```python
from supabase import create_client
import pandas as pd

supabase = create_client(url, key)
response = supabase.table('quiz_responses').select('*').execute()
df = pd.DataFrame(response.data)

# Анализ отказов
abandoned = df[df['is_partial'] == True]
print(abandoned['current_question'].value_counts())
```

3. **SQL аналитика**:
```sql
-- Conversion rate (процент завершивших квиз)
SELECT 
  COUNT(*) FILTER (WHERE is_partial = false) * 100.0 / COUNT(*) as completion_rate
FROM quiz_responses;

-- Среднее время прохождения
SELECT 
  AVG(updated_at - created_at) as avg_duration
FROM quiz_responses
WHERE is_partial = false;
```

## Vercel + Supabase Deployment

### Настройка переменных окружения

В Vercel добавьте следующие переменные:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Как это работает

1. **Vercel Serverless Functions**: Обрабатывают API запросы
2. **Supabase**: Хранит данные в PostgreSQL
3. **Автосохранение**: Работает без проблем благодаря внешней БД

✅ **Преимущества**:
- Нет ограничений serverless функций на запись файлов
- Масштабируемость
- Реальная база данных с SQL
- Автоматические резервные копии

## Следующие шаги

Реализовано:
- ✅ Миграция на Supabase
- ✅ Автосохранение после каждого ответа
- ✅ Отслеживание частичных прохождений
- ✅ Аналитика отказов

Рекомендации для улучшения:
1. 🔄 Восстановление прогресса пользователя (если вернулся)
2. 📧 Email уведомления для незавершенных квизов
3. 📊 Расширенная аналитика (графики, тренды, воронка)
4. 🔐 Аутентификация для админ-панели
5. 📥 Экспорт данных в CSV/Excel через UI
