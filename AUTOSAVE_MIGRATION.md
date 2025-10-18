# Инструкция по применению миграции для автосохранения

## Что изменилось

Теперь квиз автоматически сохраняет ответы после каждого вопроса в Supabase. Это позволяет:
- Отслеживать частично заполненные квизы
- Анализировать, на каких вопросах пользователи чаще всего останавливаются
- Не терять данные, если пользователь закрыл страницу

## Шаг 1: Применить SQL миграцию

### Вариант A: Через Supabase Dashboard

1. Откройте ваш проект в [Supabase Dashboard](https://app.supabase.com)
2. Перейдите в **SQL Editor**
3. Создайте новый query
4. Скопируйте содержимое файла `migrations/add_partial_fields.sql`
5. Вставьте в редактор и нажмите **Run**

### Вариант B: Через Supabase CLI

```bash
# Если у вас установлен Supabase CLI
supabase db push
```

## Шаг 2: Проверить изменения

Выполните в SQL Editor:

```sql
-- Проверить структуру таблицы
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'quiz_responses';
```

Должны появиться новые поля:
- `is_partial` (boolean)
- `current_question` (integer)
- `updated_at` (timestamp with time zone)

## Шаг 3: Настроить Row Level Security (опционально, но рекомендуется)

```sql
-- Включить RLS
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- Разрешить вставку и обновление всем (для квиза)
CREATE POLICY "Allow insert and update for everyone" ON quiz_responses
FOR ALL USING (true) WITH CHECK (true);

-- Для чтения потребуется аутентификация
-- (защита данных пользователей)
CREATE POLICY "Allow read for authenticated users" ON quiz_responses
FOR SELECT USING (auth.role() = 'authenticated');
```

## Шаг 4: Деплой обновленного кода

```bash
# Закоммитить изменения
git add .
git commit -m "Add autosave functionality for quiz"

# Запушить в main (Vercel автоматически задеплоит)
git push origin main
```

## Шаг 5: Проверить работу

1. Откройте квиз на продакшене
2. Ответьте на 2-3 вопроса
3. Проверьте в Supabase Dashboard → Table Editor → quiz_responses
4. Должна появиться запись с `is_partial = true`
5. Завершите квиз полностью
6. Запись должна обновиться: `is_partial = false` и появится `result`

## Мониторинг частичных ответов

### Просмотр незавершенных квизов

```sql
SELECT 
  id,
  name,
  current_question,
  created_at,
  updated_at
FROM quiz_responses
WHERE is_partial = true
ORDER BY updated_at DESC;
```

### Статистика по отказам

```sql
-- На каких вопросах чаще всего бросают квиз
SELECT 
  current_question,
  COUNT(*) as abandonments
FROM quiz_responses
WHERE is_partial = true
GROUP BY current_question
ORDER BY abandonments DESC;
```

### Conversion rate

```sql
-- Процент завершивших квиз
SELECT 
  COUNT(*) FILTER (WHERE is_partial = false) * 100.0 / COUNT(*) as completion_rate,
  COUNT(*) FILTER (WHERE is_partial = true) as abandoned,
  COUNT(*) FILTER (WHERE is_partial = false) as completed,
  COUNT(*) as total
FROM quiz_responses;
```

## Очистка старых частичных ответов (рекомендуется настроить cron)

```sql
-- Удалить частичные ответы старше 7 дней
DELETE FROM quiz_responses
WHERE is_partial = true
AND updated_at < NOW() - INTERVAL '7 days';
```

## Troubleshooting

### Ошибка: "relation quiz_responses does not exist"
- Убедитесь, что таблица создана (см. SUPABASE_SETUP.md)

### Ошибка: "column is_partial does not exist"
- Примените миграцию (Шаг 1)

### Данные не сохраняются
- Проверьте переменные окружения `SUPABASE_URL` и `SUPABASE_ANON_KEY` в Vercel
- Проверьте логи в Vercel → Functions → submit

### RLS блокирует запросы
- Проверьте политики RLS
- Для тестирования можно временно отключить: `ALTER TABLE quiz_responses DISABLE ROW LEVEL SECURITY;`

## Что дальше?

После применения миграции можно:
1. Настроить email-уведомления для незавершенных квизов
2. Добавить восстановление прогресса (если пользователь вернулся)
3. Расширить аналитику в stats.html для отображения частичных ответов
