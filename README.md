# Derdine Forum

A full-stack forum application with web and mobile clients.

## Project Structure

```
BLP232/
├── backend/          # Node.js API server (Elysia + MongoDB)
├── client/           # Next.js web application
└── mobile/           # Android application (Kotlin + Jetpack Compose)
```

## Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Password hashing with SHA-256

### Web Client
- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Mobile Client
- **Language**: Kotlin
- **UI Framework**: Jetpack Compose with Material 3
- **HTTP Client**: Retrofit
- **Architecture**: MVVM with ViewModel

## Getting Started

### Prerequisites
- Node.js 18+ or Bun
- MongoDB instance (local or Atlas)
- Android Studio (for mobile development)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/derdine-forum
PORT=3001
PASSWORD_SALT=your_secret_salt
```

4. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Web Client Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
```

The web app will be available at `http://localhost:3000`

### Mobile Setup

1. Open the `mobile` folder in Android Studio
2. Sync Gradle files
3. Update the API base URL in `ForumApi.kt` if needed:
   - For emulator: `http://10.0.2.2:3001/`
   - For physical device: Use your computer's local IP
4. Run on emulator or device

## API Endpoints

### Authentication
- `POST /api/users/login` - User login

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `POST /api/users/:id/change-password` - Change password

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID

### Threads
- `GET /api/threads` - Get all threads (with filters)
- `GET /api/threads/:id` - Get thread by ID
- `POST /api/threads` - Create new thread
- `POST /api/threads/:id/like` - Like/unlike thread

### Replies
- `GET /api/replies` - Get replies (with filters)
- `POST /api/replies` - Create new reply
- `POST /api/replies/:id/like` - Like/unlike reply

### Theme & Labels
- `GET /api/theme` - Get theme configuration
- `GET /api/labels` - Get UI labels

### Admin
- `POST /api/admin/seed` - Seed database with initial data

## Features

- User authentication and session management
- Category-based thread organization
- Thread creation and viewing
- Reply system with nested discussions
- Like/unlike functionality for threads and replies
- Customizable theme colors
- Configurable UI labels
- Admin panel for content management
- Search functionality
- User profiles with reputation system

## Database Models

- **User**: Username, email, password (hashed), badge, reputation
- **Category**: Name, description, icon, color, thread count
- **Thread**: Title, content, author, category, views, likes, replies
- **Reply**: Content, author, thread reference, likes
- **Theme**: Color scheme configuration
- **Labels**: UI text labels for internationalization

## Security

- Passwords are hashed using SHA-256 with salt
- User ID verification for protected actions
- Admin-only endpoints require admin badge verification

## License

This project is for educational purposes.
