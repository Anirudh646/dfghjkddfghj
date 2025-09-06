# AI Admission Counsellor Frontend

A modern React/Next.js frontend for the AI Admission Counsellor platform, built with TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **Student Dashboard**: Comprehensive profile management and progress tracking
- **College Matching**: AI-powered college recommendations with detailed comparisons
- **Essay Review**: Upload, edit, and get AI-powered feedback on college essays
- **Q&A Knowledge Base**: Comprehensive searchable database of admission guidance
- **Notification Center**: Smart reminders and deadline tracking
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Headless UI
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State Management**: React Query for server state
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios

## 📦 Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your backend API URL:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── dashboard/          # Protected dashboard pages
│   │   │   ├── colleges/       # College matching interface
│   │   │   ├── essays/         # Essay management
│   │   │   ├── notifications/  # Notification center
│   │   │   └── page.tsx        # Main dashboard
│   │   ├── qa/                 # Q&A knowledge base
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── providers.tsx       # App providers
│   ├── components/
│   │   └── ui/                 # Reusable UI components
│   │       └── Button.tsx      # Custom button component
│   └── lib/
│       ├── api.ts              # API client and types
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) - For main actions and branding
- **Secondary**: Gray (#64748B) - For text and backgrounds
- **Success**: Green (#22C55E) - For positive states
- **Warning**: Yellow (#F59E0B) - For cautionary states
- **Error**: Red (#EF4444) - For errors and critical actions

### Typography
- **Display Font**: Lexend - For headings and important text
- **Body Font**: Inter - For body text and UI elements

### Components
- **Cards**: Clean white backgrounds with subtle shadows
- **Buttons**: Multiple variants (primary, secondary, outline, ghost)
- **Badges**: Color-coded status indicators
- **Forms**: Consistent input styling with validation states

## 📱 Pages Overview

### Homepage (`/`)
- Hero section with feature highlights
- Statistics showcase
- Call-to-action sections
- Responsive navigation

### Dashboard (`/dashboard`)
- Student profile overview
- Progress tracking cards
- Quick action buttons
- Recent activity feed

### College Matching (`/dashboard/colleges`)
- Advanced filtering and search
- College comparison cards
- Match scoring system
- Save and compare functionality

### Essay Center (`/dashboard/essays`)
- Essay creation and management
- AI-powered review system
- Progress tracking
- Writing tips and resources

### Q&A Knowledge Base (`/qa`)
- Searchable question database
- Category filtering
- Expandable answers
- AI-generated comprehensive responses

### Notification Center (`/dashboard/notifications`)
- Smart deadline reminders
- Progress notifications
- Customizable notification settings
- Priority-based organization

## 🔧 Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting
npm run lint

# Type checking
npm run type-check
```

### Code Quality

The project includes:
- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Type safety throughout the application
- **Prettier**: Code formatting (can be added)
- **Path Aliases**: Clean imports with `@/` prefix

### Environment Variables

```bash
# Required
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## 🌐 API Integration

The frontend integrates with the FastAPI backend through:

- **Student API**: Profile management and CRUD operations
- **College API**: Matching algorithms and recommendations
- **Essay API**: Document management and AI reviews
- **Notification API**: Real-time updates and preferences

All API calls are handled through the centralized `api.ts` file with:
- Automatic request/response interceptors
- Error handling and retry logic
- TypeScript interfaces for type safety
- React Query for caching and synchronization

## 📊 Performance

- **Code Splitting**: Automatic route-based splitting with Next.js
- **Image Optimization**: Next.js built-in image optimization
- **Caching**: React Query for efficient data fetching
- **Bundle Analysis**: Built-in webpack bundle analyzer

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Docker
```bash
# Build Docker image
docker build -t admission-counsellor-frontend .

# Run container
docker run -p 3000:3000 admission-counsellor-frontend
```

### Static Export
```bash
npm run build
npm run export
```

## 🔮 Future Enhancements

- **Real-time Chat**: Live counselor support
- **Mobile App**: React Native version
- **Offline Support**: PWA capabilities
- **Advanced Analytics**: User behavior tracking
- **Accessibility**: WCAG compliance improvements
- **Internationalization**: Multi-language support

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the existing code style and patterns
4. Add TypeScript types for new features
5. Test thoroughly on different screen sizes
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
