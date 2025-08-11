# Workout Tracker - Project Structure

## File Tree

```
fitness-workout-tracker/
├── public/
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   ├── apple-touch-icon.svg
│   └── masked-icon.svg
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx           # Main dashboard with today's status and recent activity
│   │   ├── ExerciseList.tsx        # Exercise management (CRUD operations)
│   │   ├── Header.tsx              # App header component (unused in current layout)
│   │   ├── ImportExport.tsx        # CSV import/export functionality
│   │   ├── Navigation.tsx          # Bottom navigation bar
│   │   ├── Stats.tsx               # Statistics and analytics dashboard
│   │   ├── Targets.tsx             # Workout targets/goals management
│   │   ├── TemplateManager.tsx     # Workout template creation and management
│   │   └── WorkoutLogger.tsx       # Main workout logging interface
│   ├── data/
│   │   └── defaultExercises.ts     # Default exercise data (currently empty)
│   ├── hooks/
│   │   └── useLocalStorage.ts      # Custom hook for localStorage management
│   ├── types/
│   │   └── index.ts                # TypeScript type definitions
│   ├── utils/
│   │   ├── csvExport.ts            # CSV export utilities
│   │   ├── csvImport.ts            # CSV import and parsing utilities
│   │   ├── dateUtils.ts            # Date formatting and manipulation utilities
│   │   └── maxRepUtils.ts          # Max/average rep calculation utilities
│   ├── App.tsx                     # Main application component
│   ├── index.css                   # Global CSS with Tailwind imports
│   ├── main.tsx                    # Application entry point
│   └── vite-env.d.ts              # Vite environment type definitions
├── .gitignore                      # Git ignore rules
├── .bolt/                          # Bolt configuration files
│   ├── config.json
│   └── prompt
├── eslint.config.js                # ESLint configuration
├── index.html                      # Main HTML template
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # Locked dependency versions
├── postcss.config.js               # PostCSS configuration
├── README.md                       # Project documentation
├── tailwind.config.js              # Tailwind CSS configuration
├── tsconfig.app.json               # TypeScript config for app
├── tsconfig.json                   # Main TypeScript configuration
├── tsconfig.node.json              # TypeScript config for Node.js
└── vite.config.ts                  # Vite build configuration with PWA
```

## Component Overview

### Core Components

- **App.tsx**: Main application state management and routing
- **Navigation.tsx**: Bottom navigation with 7 tabs (Dashboard, Exercises, Templates, Workout, Targets, Stats, Import)

### Feature Components

- **Dashboard.tsx**: Home screen showing training percentages, today's workout status, and recent activity
- **WorkoutLogger.tsx**: Primary workout interface with exercise selection, set logging, and template integration
- **ExerciseList.tsx**: Exercise management with category filtering and CRUD operations
- **Stats.tsx**: Comprehensive analytics including training percentages, exercise comparisons, and progress charts
- **Targets.tsx**: Goal setting and progress tracking for workout targets
- **TemplateManager.tsx**: Create, edit, and use workout templates
- **ImportExport.tsx**: CSV import/export functionality with data management tools

### Utility Modules

- **csvExport.ts**: Export workouts, exercises, and targets to CSV format
- **csvImport.ts**: Parse and import CSV data with validation
- **dateUtils.ts**: Date formatting and comparison utilities
- **maxRepUtils.ts**: Calculate max reps and averages for exercise tracking
- **useLocalStorage.ts**: Custom React hook for persistent data storage

### Type Definitions

- **types/index.ts**: Complete TypeScript interfaces for Exercise, Workout, WorkoutSet, WorkoutTemplate, WorkoutTarget, and statistics

## Key Features

1. **Exercise Management**: Create, edit, delete exercises with 8 predefined categories
2. **Workout Logging**: Log sets and reps with real-time max/average display
3. **Template System**: Save and reuse workout routines
4. **Target Tracking**: Set and monitor workout goals (weekly/monthly/yearly)
5. **Statistics Dashboard**: Training percentages, progress charts, exercise analytics
6. **Data Import/Export**: CSV support for data backup and migration
7. **PWA Support**: Installable web app with offline capabilities
8. **Responsive Design**: Mobile-first design with Solarized color scheme

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom Solarized theme
- **Build Tool**: Vite
- **PWA**: vite-plugin-pwa
- **Icons**: Lucide React
- **Storage**: localStorage with custom hook
- **Linting**: ESLint with TypeScript support

## Color Palette

Custom category colors:
- Abs: #FFE6A9 (light yellow)
- Arms: #9EC6F3 (light blue)
- Back: #898AC4 (purple-blue)
- Shoulders: #E5E0D8 (light beige)
- Chest: #D1D8BE (moss grey)
- Cardio: #819A91 (green-teal)
- Legs: #A7C1A8 (sage green)
- Full Body: #E5989B (dusty rose)