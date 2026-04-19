# AI Mock Interview Platform

A modern, AI-powered platform to help users prepare for job interviews through realistic mock interviews. The platform leverages voice-based interactions, AI-generated questions, and detailed feedback to enhance interview skills. Built with a scalable monorepo architecture, it supports multi-attempt tracking, analytics, and PDF exports.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure email/password and Google OAuth2 login with JWT-based access and refresh tokens.
- **Job Profile Management**: Create, edit, and delete job profiles with details like role, company, skills, and experience level.
- **AI-Powered Question Generation**: Generate 8–10 technical and behavioral questions using Google Gemini API (with OpenAI fallback).
- **Real-Time Voice Interviews**: Conduct mock interviews with Vapi.ai, presenting questions one at a time and capturing live transcriptions.
- **Multi-Attempt Tracking**: Save each interview attempt with Q&A logs, timestamps, and duration.
- **AI Evaluation**: Evaluate answers with scores (1–10), strengths, and areas to improve using Gemini API.
- **Analytics & Visualization**: View score breakdowns, bar and radar charts for skills, and export sessions as PDFs.
- **User Dashboard**: (Planned for Phase 9) Track job profiles, interview attempts, and progress over time.
- **Security**: JWT blacklisting, rate limiting, input validation, and CORS restrictions.

## Tech Stack

### Frontend

- **Next.js**: Server-side rendering and static site generation
- **Tailwind CSS**: Utility-first styling
- **TypeScript**: Type safety
- **Redux Toolkit & RTK Query**: State management and API calls
- **React Router**: Client-side routing (integrated with Next.js)
- **Redux Persist**: Persistent state storage
- **Recharts**: Data visualization for charts
- **React-PDF**: PDF generation for session exports

### Backend

- **Node.js & Express.js**: RESTful API server
- **Socket.io**: Real-time communication (for future enhancements)
- **MongoDB & Mongoose**: NoSQL database and schema management
- **JWT**: Authentication with access and refresh tokens
- **Passport.js**: Google OAuth2 integration
- **Helmet, Joi, CORS**: Security and input validation

### AI & Voice

- **Google Gemini API**: Question generation and answer evaluation
- **OpenAI API**: Fallback for AI services
- **Vapi.ai SDK**: Real-time voice interviews

### DevOps & Testing

- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline for linting, testing, and deployment
- **Vercel**: Frontend deployment
- **Railway/Render**: Backend deployment
- **Jest, Supertest, React Testing Library**: Unit and API testing

## Project Structure

```
ai-mock-interview-platform/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── components/     # Reusable React components (e.g., JobProfileForm, ProtectedRoute)
│   │   ├── features/       # Redux slices (e.g., authSlice)
│   │   ├── pages/          # Next.js pages (e.g., login, job-profiles, interview)
│   │   ├── services/       # RTK Query API definitions
│   │   ├── styles/         # Tailwind CSS
│   │   └── store.ts        # Redux store configuration
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/         # Mongoose schemas (e.g., User, JobProfile, InterviewSession)
│   │   ├── routes/         # Express routes (e.g., auth, jobProfiles, interviewSessions)
│   │   ├── middleware/     # Authentication and validation middleware
│   │   ├── utils/          # Utility functions (e.g., JWT, AI services)
│   │   └── index.ts        # Server entry point
├── .github/                # GitHub Actions workflows
├── Dockerfile              # Docker configuration
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## Getting Started

### Prerequisites

- **Node.js**: v20.x (LTS)
- **MongoDB**: v7.x (local or Atlas)
- **Docker**: For containerized deployment
- **API Keys**:
  - Google Gemini API
  - OpenAI API
  - Vapi.ai API
  - Google OAuth2 (Client ID and Secret)

### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/ai-mock-interview-platform.git
   cd ai-mock-interview-platform
   ```

2. **Install Dependencies**:

   **Frontend**:

   ```bash
   cd client
   npm install
   ```

   **Backend**:

   ```bash
   cd ../server
   npm install
   ```

### Environment Variables

1. **Create `client/.env.local`**:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_VAPI_API_KEY=your-vapi-api-key
   ```

2. **Create `server/.env`**:
   ```env
   MONGO_URI=mongodb://localhost:27017/mock-interview
   PORT=5000
   ACCESS_TOKEN_SECRET=your-access-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GEMINI_API_KEY=your-gemini-api-key
   OPENAI_API_KEY=your-openai-api-key
   ```

### Running the Application

1. **Backend**:

   ```bash
   cd server
   npm run dev
   ```

   The server will run on http://localhost:5000.

2. **Frontend**:

   ```bash
   cd client
   npm run dev
   ```

   The frontend will run on http://localhost:3000.

3. **Docker (Optional)**:

   Create a `Dockerfile` in the root:

   ```dockerfile
   FROM node:20
   WORKDIR /app
   COPY package*.json ./
   COPY client ./client
   COPY server ./server
   RUN cd client && npm install && npm run build
   RUN cd server && npm install
   EXPOSE 5000 3000
   CMD ["sh", "-c", "cd server && npm run start & cd client && npm run start"]
   ```

   Build and run:

   ```bash
   docker build -t ai-mock-interview .
   docker run -p 3000:3000 -p 5000:5000 ai-mock-interview
   ```

## Usage

1. **Register/Login**: Sign up with email/password or Google OAuth2.
2. **Create Job Profile**: Add a job profile with role, company, skills, and experience level.
3. **Generate Questions**: Use the AI to generate 8–10 questions for the profile.
4. **Start Interview**: Conduct a voice-based mock interview with Vapi.ai, answering questions one at a time.
5. **Evaluate Answers**: Get AI-driven feedback with scores, strengths, and areas to improve.
6. **View Analytics**: Check score breakdowns, bar/radar charts, and export session summaries as PDFs.
7. **Retry Interview**: Start a new session to improve your performance.

## API Endpoints

| Method | Endpoint                             | Description                          |
| ------ | ------------------------------------ | ------------------------------------ |
| POST   | `/auth/register`                     | Register a new user                  |
| POST   | `/auth/login`                        | Login with credentials               |
| GET    | `/auth/refresh-token`                | Refresh access token                 |
| GET    | `/auth/google`                       | Initiate Google OAuth2               |
| POST   | `/api/job-profiles`                  | Create a job profile                 |
| GET    | `/api/job-profiles`                  | List user's job profiles             |
| GET    | `/api/job-profiles/:id`              | Get specific job profile             |
| PUT    | `/api/job-profiles/:id`              | Update a job profile                 |
| DELETE | `/api/job-profiles/:id`              | Delete a job profile                 |
| POST   | `/api/generate-questions/:id`        | Generate questions for a job profile |
| POST   | `/api/interview-sessions/:id`        | Create a new interview session       |
| GET    | `/api/interview-sessions/:id`        | Get detailed session                 |
| POST   | `/api/evaluate-answer/:sessionId`    | Evaluate session answers             |
| GET    | `/api/interview-session/:id/summary` | Get session summary                  |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

Please follow the Code of Conduct and ensure tests pass before submitting.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
