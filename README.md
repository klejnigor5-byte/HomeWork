# Express Passport Authentication

Навчальний REST API на Node.js та Express із Passport Local Strategy, `express-session` і cookie-сесіями.

## Функціональність

- Реєстрація за email і паролем.
- Хешування паролів за допомогою `bcrypt`.
- Вхід через Passport Local Strategy.
- Сесія користувача зберігається в `express-session`.
- Cookie має `httpOnly`, `sameSite: "lax"` і `secure` у production.
- Захищений маршрут `/protected`.
- Перевірка поточного користувача та вихід із системи.
- Валідація вхідних даних та централізована обробка помилок.

> **Важливо:** для простоти навчального завдання користувачі зберігаються в масиві в пам'яті. Вони зникають після перезапуску сервера. Для реального застосунку використайте базу даних і постійне сховище сесій. Стандартний MemoryStore не призначений для production.

## Встановлення та запуск

Потрібен Node.js (LTS) та npm.

```bash
npm install
```

Скопіюйте `.env.example` у `.env` та задайте власний довгий випадковий `SESSION_SECRET`.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Запустіть сервер:

```bash
npm run dev
```

або:

```bash
npm start
```

Сервер працює за адресою `http://localhost:3000`.

У production необхідно встановити `NODE_ENV=production`, використовувати HTTPS і налаштувати довірений reverse proxy, якщо сервер працює за проксі. Не публікуйте `.env`.

## Маршрути

| Метод | Маршрут | Опис |
|---|---|---|
| GET | `/` | Інформація про API та маршрути |
| POST | `/auth/register` | Реєстрація. JSON: `{"email":"user@example.com","password":"strongpass123"}` |
| POST | `/auth/login` | Вхід. JSON: `{"email":"user@example.com","password":"strongpass123"}` |
| POST | `/auth/logout` | Вихід і знищення сесії |
| GET | `/auth/me` | Повертає поточного користувача, якщо авторизований |
| GET | `/protected` | Захищений маршрут; вимагає чинну сесію |

Після реєстрації або входу збережіть cookie, яку повернув сервер, та надсилайте її в наступних запитах. У Postman увімкніть cookie jar. Для `curl` можна використовувати `-c cookies.txt` та `-b cookies.txt`.

## Приклади перевірки через curl

Реєстрація:

```bash
curl -i -c cookies.txt -H "Content-Type: application/json" -d "{\"email\":\"user@example.com\",\"password\":\"strongpass123\"}" http://localhost:3000/auth/register
```

Захищений маршрут із cookie:

```bash
curl -i -b cookies.txt http://localhost:3000/protected
```

Поточний користувач:

```bash
curl -i -b cookies.txt http://localhost:3000/auth/me
```

Вихід:

```bash
curl -i -b cookies.txt -X POST http://localhost:3000/auth/logout
```

Перевірте також, що `GET /protected` без cookie повертає `401 Unauthorized`.

## Структура проєкту

```text
express-passport-auth/
├── config/
│   └── passport.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorMiddleware.js
│   └── validationMiddleware.js
├── routes/
│   ├── authRoutes.js
│   └── protectedRoutes.js
├── .env.example
├── .gitignore
├── app.js
├── package.json
├── server.js
└── README.md
```

## Публікація в GitHub

Створіть порожній репозиторій на GitHub, потім виконайте в папці проєкту:

```bash
git init
git add .
git commit -m "Implement Passport authentication"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/express-passport-auth.git
git push -u origin main
```

Замініть `YOUR_USERNAME` на свій логін GitHub. Перед здачею перевірте, що `.env` і `node_modules` не потрапили до репозиторію.
