# EduFlow LMS Platform - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a modern Learning Management System (LMS) called EduFlow built with:
- Next.js 15 with App Router and TypeScript
- Firebase for authentication, Firestore database, and static hosting
- Tailwind CSS for responsive UI
- Radix UI components for accessibility
- React Hook Form with Zod validation
- pnpm as package manager

## Architecture Guidelines
- Use Firebase Auth for user authentication (students, instructors, admins)
- Store course data, user progress, and content in Firestore
- Implement responsive mobile-first design
- Use TypeScript for type safety
- Follow React best practices with hooks and context
- Implement proper error handling and loading states

## Key Features to Implement
- User authentication and role-based access
- Course creation and management
- Video/content delivery
- Progress tracking and analytics
- Interactive quizzes and assignments
- Discussion forums
- Notifications system
- Mobile-responsive design

## Code Style
- Use functional components with hooks
- Implement proper TypeScript interfaces
- Use Tailwind CSS classes for styling
- Follow Next.js 15 App Router patterns
- Use Firebase v9+ modular SDK
- Implement proper error boundaries
