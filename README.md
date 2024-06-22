# Kanban Board
This project is a full-stack Kanban board application built with Next.js 14, TypeScript, and Prisma. It features authentication, board management, and card management functionalities. The project utilizes Next.js API routes and the App Router concept, and it is designed to run with Docker.

## Table of Contents
- Kanban Board
    - Table of Contents
    - Features
    - Project Structure
    - Technologies Used
    - Prerequisites
    - Getting Started
        - Clone the Repository
        - Environment Variables
        - Install Dependencies
        - Database Setup
        - Run the Application
    - API Endpoints
    - Database Schema
    - Running in Docker
    - License

### Features

- User authentication (register, login, logout)
- Board creation and management
- Card creation, listing, and updating within boards
- Organized using sections within boards
- Uses Prisma for database management
- API routes managed with Next.js App Router

### Project Structure

```bash 
kanban-board
├─ .dockerignore
├─ .eslintrc.json
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ schema.prisma
│  └─ seed.js
├─ public
├─ server
│  └─ db
│     └─ client.ts
├─ src
│  ├─ app
│  │  ├─ api
│  │  │  └─ v1
│  │  │     ├─ auth
│  │  │     │  ├─ login
│  │  │     │  │  └─ route.ts
│  │  │     │  ├─ logout
│  │  │     │  │  └─ route.ts
│  │  │     │  └─ register
│  │  │     │     └─ route.ts
│  │  │     ├─ boards
│  │  │     │  └─ route.ts
│  │  │     └─ card
│  │  │        ├─ order
│  │  │        │  └─ route.ts
│  │  │        ├─ route.ts
│  │  │        └─ section
│  │  │           └─ route.ts
│  │  ├─ auth
│  │  │  ├─ layout.tsx
│  │  │  ├─ login
│  │  │  │  └─ page.tsx
│  │  │  └─ register
│  │  │     └─ page.tsx
│  │  ├─ dashboard
│  │  │  ├─ board
│  │  │  │  └─ [id]
│  │  │  │     └─ page.tsx
│  │  │  ├─ layout.tsx
│  │  │  └─ page.tsx
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ not-found.tsx
│  ├─ components
│  │  ├─ AuthLink.tsx
│  │  ├─ Button.tsx
│  │  ├─ Card.tsx
│  │  ├─ CreateBoardModal.tsx
│  │  ├─ Input.tsx
│  │  ├─ Modal.tsx
│  │  ├─ Nav.tsx
│  │  └─ board
│  │     ├─ AddCardModal.tsx
│  │     ├─ Card.tsx
│  │     └─ Section.tsx
│  ├─ context
│  │  └─ BoardContext.tsx
│  ├─ middleware.ts
│  ├─ services
│  │  └─ authService.ts
│  ├─ utils
│  │  ├─ crypto.ts
│  │  ├─ errorHandler.ts
│  │  ├─ jwt.ts
│  │  ├─ request.ts
│  │  └─ response.ts
│  └─ validations
│     ├─ login
│     └─ register
│        └─ index.ts
├─ tailwind.config.ts
└─ tsconfig.json

```

### Technologies Used

- Next.js 14
- TypeScript
- Prisma
- MySQL
- TailwindCSS
- Axios
- JSON Web Tokens (JWT)
- React Beautiful DnD
- Formik
- Yup

### Prerequisites

- Node.js
- Docker (optional for containerized environment)
- MySQL

## Getting Started

### Clone the Repository

```bash 
git clone https://github.com/batuhanzorbeyzengin/nextjs-14-kanban-board.git
cd nextjs-14-kanban-board
```

### Environment Variables
Create a `.env.local` file at the root of the project and add the following variables:

```plaintext 
DATABASE_URL="mysql://root:root@localhost:8889/kanban_board"
JWT_SECRET="TV0Iai6XKyIcOMHX2OLFupHkcsYmbdk2"
```

### Install Dependencies

```bash
npm install
```

### Database Setup
Push the Prisma schema to your database:

```bash
npm run db:push
npm run db:seed
```

### Run the Application
Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## API

For API connections, you need to import the json file in the document folder into postman.

## Database Schema

```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  boards    Board[]
  sessions  Session[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Board {
  id        String    @id @default(uuid())
  name      String    @unique
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  cards     Card[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}

model Section {
  id        String    @id @default(uuid())
  name      String    @unique
  order     Int
  cards     Card[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
}

model Card {
  id        String    @id @default(uuid())
  title     String
  color     String
  order     Int
  sectionId String
  section   Section   @relation(fields: [sectionId], references: [id])
  boardId   String
  board     Board     @relation(fields: [boardId], references: [id])
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?
  @@index([sectionId, order], name: "index_card_order")
}

model Session {
  id        String    @id @default(uuid())
  userId    String
  user      User      @relation(fields: [userId], references: [id])
  token     String    @db.VarChar(512)
  createdAt DateTime  @default(now())
  expiresAt DateTime
  @@index([userId], name: "index_user_session")
}

```