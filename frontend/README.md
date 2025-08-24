# FinFix Frontend

## Настройка

1. Создайте файл `.env.local` в корне frontend директории:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите development сервер:

```bash
npm run dev
```

## Структура API

- `apiGet<T>(path)` - GET запрос
- `apiPost<T>(path, body)` - POST запрос
- `apiPut<T>(path, body)` - PUT запрос
- `apiDelete<T>(path)` - DELETE запрос
- `apiPatch<T>(path, body)` - PATCH запрос

Все запросы автоматически включают:

- CSRF токен из cookie
- Credentials для работы с cookies
- Правильные заголовки Content-Type и Accept

## Аутентификация

- `getCurrentUser()` - получение текущего пользователя
- `logout()` - выход из системы

## Роуты

- `/login` - страница входа
- `/dashboard` - защищенная страница дашборда
- `/auth/callback` - обработка OAuth callback
