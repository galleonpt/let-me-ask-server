# Let me ask

A real-time Q&A platform developed during the **NLW Agents** event. This project allows users to create rooms, ask questions, and receive AI-powered responses with audio upload capabilities.

## 🚀 Tech Stack

### Backend

- **Fastify** - High-performance web framework
- **TypeScript** - Type-safe JavaScript
- **Drizzle ORM** - Type-safe database toolkit
- **PostgreSQL** with **pgvector** - Vector database for AI features
- **Zod** - Schema validation
- **Google Gemini AI** - AI-powered responses

### Development Tools

- **Biome** - Fast formatter and linter
- **Docker Compose** - Local development environment
- **Drizzle Kit** - Database migrations and seeding

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- Google Gemini API key

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/galleonpt/let-me-ask-server

cd server

npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory by copying the `.env.example` file.

### 3. Start Database

```bash
docker-compose up -d
```

### 4. Run Database Migrations

```bash
npx drizzle-kit migrate
```

### 5. Seed Database (Optional)

```bash
npm run db:seed
```

### 6. Start Development Server

```bash
npm start
```

## 🏗️ Project Structure

```
src/
├── database/
│   ├── connection.ts      # Database connection
│   ├── migrations/        # Database migrations
│   ├── schema/           # Database schemas
│   └── seed.ts           # Database seeding
├── http/
│   └── routes/           # API endpoints
├── services/
│   └── gemini.ts         # AI service integration
├── env.ts                # Environment validation
└── server.ts             # Application entry point
```

## 🔌 API Endpoints

### `GET /rooms`

List all rooms with question counts.

**Response:**

```json
[
  {
    "id": "string",
    "name": "string",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "questionsCount": 5
  }
]
```

### `POST /rooms`

Create a new room.

**Request Body:**

```json
{
  "name": "string",
  "description": "string (optional)"
}
```

**Response:**

```json
{
  "roomId": "string"
}
```

### `GET /rooms/:roomId/questions`

Get all questions for a specific room.

**Response:**

```json
[
  {
    "id": "string",
    "question": "string",
    "answer": "string | null",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
]
```

### `POST /rooms/:roomId/questions`

Create a new question in a room. The system will automatically search for similar audio chunks and generate an AI-powered answer.

**Request Body:**

```json
{
  "question": "string"
}
```

**Response:**

```json
{
  "questionId": "string",
  "answer": "string | null"
}
```

### `POST /rooms/:roomId/audio`

Upload an audio file for a room. The audio will be transcribed and stored with embeddings for similarity search.

**Request:** Multipart form data with audio file

**Response:**

```json
{
  "chunkId": "string"
}
```

## 🎯 Key Features

- **Real-time Q&A**: Create rooms and ask questions
- **AI Integration**: Powered by Google Gemini for intelligent responses
- **Audio Upload**: Support for audio file processing
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Vector Database**: PostgreSQL with pgvector for AI features

## 📝 Development

The project uses:

- **Biome** for code formatting and linting
- **Drizzle Kit** for database management
- **Fastify** with TypeScript for high-performance API development

## 🤝 Contributing

This project was developed during the NLW Agents event. For contributions, please follow the established patterns and ensure all code is properly typed and validated.
