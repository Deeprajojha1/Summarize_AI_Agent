# NexFlow AI

> A production-style AI-powered SaaS dashboard built with TypeScript, React, Node.js, MongoDB, Gemini API, and LangChain-style tool calling.

NexFlow AI is an **AI Productivity Command Center** for busy IT professionals, developers, and productivity-focused users. The goal is to provide one premium dashboard where a user can manage tasks, track developer activity, view live weather, follow AI/tech news, and ask an intelligent AI assistant for useful recommendations.

This project is designed as an internship-level full-stack assessment that demonstrates scalable architecture, modern UI thinking, secure authentication, API integration, and practical AI engineering.

---

## Core Idea

Most dashboards only show data. NexFlow AI goes one step further:

- It collects useful productivity signals.
- It connects live APIs such as weather, news, and GitHub.
- It allows users to manage tasks.
- It uses an AI agent to understand user intent.
- It dynamically selects the right tool/API.
- It returns meaningful, action-focused answers.

Example:

```text
User: What is happening in AI today?

NexFlow AI:
1. Detects news-related intent
2. Calls the News tool
3. Fetches latest AI news
4. Summarizes it with Gemini
5. Returns useful insights and next actions
```

---

## Product Vision

NexFlow AI feels like a modern AI operating system for work.

The user should feel:

- Organized
- Informed
- Assisted by AI
- Productive
- In control

The UI is inspired by premium products like Vercel, Linear, Notion AI, Stripe Dashboard, ChatGPT, and Perplexity.

---

## Tech Stack

### Frontend

- React.js
- Vite
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- React Toastify
- React Icons
- Framer Motion
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- HTTP-only Cookies
- bcryptjs
- Zod validation
- MVC architecture

### AI Layer

- Gemini API
- LangChain-style tool architecture
- Dynamic tool selection
- Tool calling pattern
- AI-powered productivity suggestions

---

## Key Features

### 1. Secure Authentication

- Signup
- Login
- Logout
- Protected routes
- Session persistence
- Password hashing with bcrypt
- JWT stored only in HTTP-only cookies
- No auth token stored in localStorage

### 2. AI Assistant Panel

- Floating AI chat panel
- Smart prompt suggestions
- Typing animation
- Context-aware answers
- Tool usage labels
- Gemini-powered responses when API key is added
- Demo fallback response when Gemini key is missing

### 3. Live Weather Widget

- City search
- Temperature
- Humidity
- Wind speed
- Weather condition
- OpenWeatherMap integration

### 4. AI and Developer News

- Latest AI news
- Developer news
- Categorized news cards
- AI-ready summaries
- NewsAPI integration

### 5. GitHub Developer Activity

- GitHub profile analytics
- Repository stats
- Followers
- Public repositories
- Stars
- Recent repositories
- GitHub REST API integration

### 6. Smart Task Management

- Create tasks
- Update tasks
- Delete tasks
- Priority levels
- Progress tracking
- Status handling
- AI task summary support

### 7. Analytics Dashboard

- Productivity score chart
- Developer activity chart
- Animated stat cards
- Dashboard overview metrics

---

## AI Agent Architecture

The backend contains a modular AI agent structure:

```text
server/src/agents/
├── aiAgent.ts
├── toolRegistry.ts
└── promptTemplates.ts

server/src/tools/
├── weatherTool.ts
├── newsTool.ts
├── githubTool.ts
└── taskTool.ts
```

### How It Works

1. User sends a message from the AI panel.
2. Backend receives the message at `/api/ai/chat`.
3. Agent analyzes the user intent.
4. Tool registry selects the correct tool.
5. Selected tool calls the required service/API.
6. Gemini receives the tool observation.
7. AI returns a clean answer with suggestions.

Supported tools:

- Weather Tool
- News Tool
- GitHub Tool
- Task Tool

---

## Folder Structure

```text
Nxtwave_Assment1/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── styles/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── src/
│   │   ├── agents/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── tools/
│   │   ├── types/
│   │   ├── utils/
│   │   └── validations/
│   ├── package.json
│   └── tsconfig.json
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## API Routes

### Auth

| Method | Route | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | Create user account |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current session user |
| PUT | `/api/auth/profile` | Update user profile |

### Dashboard APIs

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/weather?city=Delhi` | Fetch weather |
| GET | `/api/news?category=ai` | Fetch AI/dev news |
| GET | `/api/github/:username` | Fetch GitHub stats |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| PATCH | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/ai/chat` | Ask AI agent |

---

## Environment Variables

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

### `server/.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/nexflow_ai
JWT_SECRET=replace-this-with-a-long-random-secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=
OPENWEATHER_API_KEY=
NEWS_API_KEY=
GITHUB_TOKEN=
```

API keys can be added later. The app includes demo fallback data for development.

---

## Run Locally

### 1. Install dependencies

```bash
npm run install:all
```

### 2. Start MongoDB with Docker

```bash
docker compose up -d
```

### 3. Run frontend and backend together

```bash
npm run dev
```

Or run separately:

```bash
npm run dev --prefix client
npm run dev --prefix server
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## Security Decisions

This project follows secure authentication practices:

- JWT is stored in HTTP-only cookies.
- No token is stored in localStorage.
- Passwords are hashed before saving.
- Protected routes are validated by middleware.
- CORS is configured with credentials.
- Request validation is handled with Zod.
- Errors are handled through centralized middleware.

---

## Interview Explanation

You can explain the project like this:

> NexFlow AI is a TypeScript-based MERN SaaS dashboard that works as an AI productivity command center. It has secure cookie-based authentication, a modular Redux frontend, live integrations for weather, news, and GitHub, smart task management, analytics charts, and a Gemini-powered AI agent. The backend follows MVC architecture and uses a LangChain-style tool registry where the AI dynamically selects the correct tool based on user intent.

---

## Why This Project Is Strong

- Shows full-stack TypeScript knowledge
- Demonstrates secure auth practices
- Uses real API integrations
- Includes AI agent architecture
- Uses scalable folder structure
- Has polished SaaS UI
- Uses Redux Toolkit professionally
- Follows backend MVC architecture
- Looks startup-ready and interview-friendly

---

## Future Improvements

- Streaming AI responses
- Voice-to-text input
- Calendar integration
- GitHub contribution graph
- Team workspaces
- Billing/subscription module
- Role-based admin dashboard
- Real-time notifications with Socket.IO

---

## Project Status

Build checks completed:

- Client TypeScript build: passed
- Backend TypeScript build: passed
- Client ESLint: passed

NexFlow AI is ready for API keys, demo recording, and internship assessment presentation.
