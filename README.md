# Hirely

AI-assisted freelance marketplace platform for project management, freelancer matching, and realtime communication.

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Material UI
- React Query
- Socket.IO Client

### Backend
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- JWT Authentication
- Socket.IO

### ML Service
- Python
- FastAPI
- OpenAI API
- joblib

---

## Project Structure

```bash
frontend/     # React frontend
backend/      # NestJS backend
ml-service/   # AI/ML microservice
```

---

## Requirements

Before running the project, install:

- Docker Desktop
- Node.js 18+
- Python 3.10+

---

## Environment Variables

### Backend (`backend/.env`)

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5444/hirely
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
PORT=3000
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
```

### ML Service (`ml-service/.env`)

```env
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4o-mini
```

---

## Running PostgreSQL

From the project root:

```bash
docker-compose up -d
```

Verify container status:

```bash
docker ps
```

---

## Running Backend

```bash
cd backend
npm install
npm run migration:run
npm run start:dev
```

Backend runs on:

```txt
http://localhost:3000
```

---

## Running Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Running ML Service

```bash
cd ml-service

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run service:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Main Features

- User authentication with JWT
- Project creation and management
- Freelancer applications
- AI-assisted project generation
- Project category prediction
- Budget prediction
- Realtime chat with Socket.IO
- Role-based access control
- Freelancer recommendation system

---

## Troubleshooting

### PostgreSQL container is not running

Check Docker Desktop and verify that port `5444` is available.

### Backend cannot connect to database

Verify `DATABASE_URL` in `backend/.env`.

### OpenAI API key error

Ensure `OPENAI_API_KEY` is specified in `ml-service/.env`.

### Frontend cannot connect to backend

Verify `VITE_API_URL`.

---

## License

This project was developed as a diploma thesis project.