# 🎓 Campus Faculty Locator Pro

> A modern, real-time faculty tracking system built with React, TypeScript, and Tailwind CSS

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## ✨ Overview

Campus Faculty Locator Pro is a comprehensive web application designed to help students and staff quickly locate faculty members across campus. The system provides real-time location tracking based on schedules, interactive campus maps, and detailed faculty information.

## 📸 Screenshots

### Home Page - Faculty Search
![Home Page](./screenshots/home.png)
*Main interface with faculty search and available faculty list*

### Add Faculty Member
![Add Faculty](./screenshots/add-faculty.png)
*Auto-generate or create custom faculty schedules*

### Custom Schedule Builder
![Schedule Builder](./screenshots/schedule-builder.png)
*Build detailed weekly schedules with time slots and locations*

### Faculty Schedule View
![Faculty Schedule](./screenshots/schedule-view.png)
*Real-time location prediction and weekly schedule display*

## 🚀 Features

### Core Functionality
- 🔍 **Smart Faculty Search** - Search by name or faculty ID
- 📍 **Real-time Location Tracking** - Know where faculty are right now
- 📅 **Weekly Schedule Management** - View complete weekly timetables
- 🗺️ **Interactive Campus Map** - Visual campus block navigation
- 🎯 **Current Location Prediction** - AI-powered location estimation based on schedule
- 🏫 **Holiday Detection** - Automatic holiday notifications

### Faculty Management
- ➕ **Add New Faculty** - Easy faculty member registration
- 🤖 **Auto-Generate Schedules** - AI-powered schedule generation
- ✏️ **Custom Schedule Builder** - Manual schedule creation with drag-and-drop
- 📊 **Department & Building Organization** - Structured data management

### User Experience
- 🎨 **Beautiful UI** - Modern design with shadcn/ui components
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🌙 **Dark Mode** - Eye-friendly dark theme
- ⚡ **Fast Performance** - Lightning-fast with Vite
- 🔔 **Toast Notifications** - Real-time feedback

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript 5** - Type-safe development
- **Vite 5** - Next-generation build tool
- **React Router 6** - Client-side routing

### UI & Styling
- **Tailwind CSS 3** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Backend & Data
- **Supabase** - Backend as a Service
- **TanStack Query** - Powerful data fetching
- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/campus-faculty-locator-pro.git
cd campus-faculty-locator-pro
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📁 Project Structure

```
campus-faculty-locator-pro/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── AddFacultyForm.tsx
│   │   ├── CampusBlockMap.tsx
│   │   ├── DailySchedule.tsx
│   │   ├── FacultyLocationBox.tsx
│   │   ├── FacultyLocatorLogo.tsx
│   │   ├── FacultySearch.tsx
│   │   ├── ScheduleBuilder.tsx
│   │   └── WeeklySchedule.tsx
│   │
│   ├── pages/              # Page components
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   │
│   ├── utils/              # Utility functions
│   │   ├── facultyData.ts
│   │   └── types.ts
│   │
│   ├── lib/                # Library utilities
│   │   └── utils.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   └── integrations/       # External integrations
│       └── supabase/       # Supabase client
│
├── public/                 # Static assets
├── config files/           # Configuration backups
└── ...
```

## 🎨 Customization

### Add Faculty Data

Edit `src/utils/facultyData.ts`:

```typescript
{
  id: "F001",
  name: "Dr. John Smith",
  department: "Computer Science",
  email: "john.smith@university.edu",
  phone: "+1234567890",
  schedule: {
    // Weekly schedule here
  }
}
```

### Modify Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  faculty: {
    primary: '#1e40af',    // Deep blue
    secondary: '#0ea5e9',  // Light blue
    accent: '#0d9488',     // Teal
  }
}
```

### Update Campus Buildings

Modify building data in `src/components/CampusBlockMap.tsx` or `src/utils/facultyData.ts`.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel dashboard:
1. Import your GitHub repository
2. Add environment variables
3. Click Deploy

### Deploy to Netlify

```bash
# Build the project
npm run build

# Upload the 'dist' folder to Netlify
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes* |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes* |

*Required only if using Supabase features

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Styled with [Tailwind CSS](https://tailwindcss.com)

## 📊 Project Stats

- **Total Lines of Code**: 50,000+
- **React Components**: 55+
- **UI Components**: 49
- **Dependencies**: 75+
- **Development Time**: [Your time here]

## 🐛 Known Issues

- Browser list data is 16 months old (run `npx update-browserslist-db@latest` to fix)
- 4 moderate security vulnerabilities in dev dependencies (non-critical)

## 🔮 Future Enhancements

- [ ] Mobile app version (React Native)
- [ ] Push notifications for schedule changes
- [ ] QR code scanning for quick faculty lookup
- [ ] Integration with university calendar
- [ ] Multi-language support
- [ ] Dark/Light mode toggle
- [ ] Email notifications
- [ ] Faculty availability status

## 💡 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ using React and TypeScript

[Report Bug](https://github.com/yourusername/campus-faculty-locator-pro/issues) · [Request Feature](https://github.com/yourusername/campus-faculty-locator-pro/issues)

</div>
