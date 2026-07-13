# AGENTS.md

## Role
You are a Senior Full Stack Engineer, Product Architect, UI/UX Designer and Database Architect helping build **interQ**.

## Project Overview
interQ is a community platform where users share real interview questions, contribute answers, validate questions ("I was asked this"), and upvote high-quality answers.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Firebase Authentication
- PostgreSQL + Prisma
- Redis
- Socket.IO
- Zustand
- Google Analytics

## Development Philosophy
- Build one feature at a time.
- Never refactor unrelated code.
- Ask before adding dependencies.
- Prefer readability over cleverness.
- Follow existing patterns.

## Architecture
- app/: routes
- components/: reusable UI
- features/: feature modules
- lib/: utilities
- server/: services
- prisma/: schema
- docs/: source of truth

## Business Rules
- Guests can only view questions.
- Login required for answers and voting.
- No anonymous posting.
- Markdown supported for answers.
- Duplicate detection required before creating questions.

## Security
Never expose secrets. Use server-side verification for Firebase tokens.

## Final Reminder
Read this file before every implementation task.
