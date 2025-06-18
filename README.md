# GoIT Node.js REST API з PostgreSQL

REST API для роботи з колекцією контактів, використовуючи Node.js, Express, PostgreSQL та Sequelize ORM.

## Встановлення

1. Клонуйте репозиторій
2. Встановіть залежності:
```bash
npm install
```

3. Створіть файл `.env` у корені проекту з наступними змінними:
```
DATABASE_URL=your_postgresql_connection_string
PORT=3000
```

4. Запустіть додаток:
```bash
npm start
```

Для розробки:
```bash
npm run dev
```

## API Endpoints

### GET /api/contacts
Отримати всі контакти

**Відповідь:**
```json
[
  {
    "id": 1,
    "name": "Allen Raymond",
    "email": "nulla.ante@vestibul.co.uk",
    "phone": "(992) 914-3792",
    "favorite": false,
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
]
```

### GET /api/contacts/:id
Отримати контакт за ID

**Відповідь:**
- 200: Об'єкт контакту
- 404: Not found

### POST /api/contacts
Створити новий контакт

**Тіло запиту:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "favorite": false
}
```

**Відповідь:**
- 201: Створений контакт
- 400: Помилка валідації
- 409: Контакт з таким email вже існує

### PUT /api/contacts/:id
Оновити контакт

**Тіло запиту:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "(555) 123-4567",
  "favorite": true
}
```

**Відповідь:**
- 200: Оновлений контакт
- 400: Помилка валідації
- 404: Not found
- 409: Контакт з таким email вже існує

### DELETE /api/contacts/:id
Видалити контакт

**Відповідь:**
- 200: Повідомлення про успішне видалення
- 404: Not found

### PATCH /api/contacts/:contactId/favorite
Оновити статус favorite контакту

**Параметри:**
- `contactId` - ID контакту

**Тіло запиту:**
```json
{
  "favorite": true
}
```

**Приклад запиту:**
```bash
curl -X PATCH http://localhost:3000/api/contacts/1/favorite \
  -H "Content-Type: application/json" \
  -d '{"favorite": true}'
```

**Відповідь 200:**
```json
{
  "id": 1,
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792",
  "favorite": true,
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

**Відповідь 404:**
```json
{
  "message": "Not found"
}
```

**Відповідь 400 (помилка валідації):**
```json
{
  "message": "Validation error details"
}
```

## Структура проекту

```
├── controllers/
│   └── contactsControllers.js  # Контролери для обробки запитів
├── db/
│   └── config.js              # Конфігурація Sequelize
├── helpers/
│   ├── HttpError.js           # Кастомна помилка HTTP
│   └── validateBody.js        # Middleware для валідації
├── models/
│   └── Contact.js             # Sequelize модель Contact
├── routes/
│   └── contactsRouter.js      # Маршрути для контактів
├── schemas/
│   └── contactsSchemas.js     # Joi схеми для валідації
├── services/
│   └── contactsServices.js    # Бізнес-логіка
├── app.js                     # Головний файл додатку
└── package.json
```

## Технології

- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- Joi (валідація)
- Morgan (логування)
- CORS 