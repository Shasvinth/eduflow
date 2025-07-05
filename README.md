# EduFlow - Modern Learning Management System

A comprehensive, modern Learning Management System (LMS) built with Next.js 15, Firebase, and TypeScript. EduFlow provides a complete platform for online education with features for students, instructors, and administrators.

## 🚀 Features

### 👨‍🎓 For Students
- **Course Discovery**: Browse and search through hundreds of courses
- **Interactive Learning**: Engage with video content, quizzes, and assignments
- **Progress Tracking**: Monitor your learning progress with detailed analytics
- **Certificates**: Earn industry-recognized certificates upon course completion
- **Mobile Responsive**: Learn anywhere, anytime on any device

### 👨‍🏫 For Instructors
- **Course Creation**: Build comprehensive courses with lessons, quizzes, and assignments
- **Student Management**: Track student progress and engagement
- **Content Upload**: Support for videos, documents, and interactive content
- **Analytics Dashboard**: Detailed insights into course performance

### 🔧 Technical Features
- **Authentication**: Secure Firebase Auth with role-based access
- **Real-time Database**: Firestore for scalable data management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Beautiful components built with Radix UI
- **Progressive Web App**: Offline capabilities and app-like experience

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **Hosting**: Firebase Hosting
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "eduflow-lms")
4. Enable Google Analytics (optional)
5. Create project

#### Enable Authentication
1. In Firebase Console, go to Authentication
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save

#### Set up Firestore Database
1. In Firebase Console, go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users
5. Done

#### Get Firebase Config
1. Go to Project Settings (gear icon)
2. Copy the Firebase config object

### 3. Environment Configuration

Create a `.env.local` file:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Build for Production
```bash
pnpm build
```

### Export for Static Hosting
```bash
# Add to next.config.ts for static export
# Then run:
pnpm build
```

### Deploy to Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

## 📚 Usage

### Demo Accounts
- **Student**: Sign up as a student to browse and enroll in courses
- **Instructor**: Sign up as an instructor to create and manage courses

### Key Features
1. **User Registration**: Sign up as student or instructor
2. **Course Browsing**: Explore available courses by category
3. **Course Enrollment**: Enroll in courses and track progress
4. **Learning Dashboard**: View enrolled courses and progress

## 🎨 Customization

The application uses Tailwind CSS with custom CSS variables for theming. You can modify colors and styling in:
- `src/app/globals.css` - Global styles and theme variables
- Components use consistent design tokens

## 🔒 Security

- Firebase Authentication provides secure user management
- Firestore security rules ensure data protection
- Role-based access control for different user types
- Environment variables protect sensitive configuration

## 📱 Mobile Support

EduFlow is built with a mobile-first approach:
- Responsive design that works on all screen sizes
- Touch-friendly interface
- Optimized performance for mobile devices
- Progressive Web App capabilities

Built with ❤️ using Next.js, Firebase, and TypeScript
