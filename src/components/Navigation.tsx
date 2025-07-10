import React from 'react';
import { Home, Dumbbell, Calendar, BarChart3, BookOpen, Upload, Target } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'workout', label: 'Workout', icon: Calendar },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
    { id: 'templates', label: 'Templates', icon: BookOpen },
    { id: 'targets', label: 'Targets', icon: Target },
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'import', label: 'Data', icon: Upload }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-solarized-base3/95 backdrop-blur-md border-t border-solarized-base2 px-2 py-1 z-50 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-screen-sm mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-all duration-200 min-w-0 ${
              activeTab === id
                ? 'text-solarized-blue bg-solarized-blue/10'
                : 'text-solarized-base01 hover:text-solarized-base00'
            }`}
          >
            <Icon size={20} className="mb-0.5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}