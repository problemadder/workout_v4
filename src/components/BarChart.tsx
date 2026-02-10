import React, { useState, useMemo } from 'react';

interface BarChartData {
  label: string;
  value: number;
  maxValue: number;
  color: string;
  workoutCount: number;
  pattern: 'Stable' | 'Variable' | 'Irregular';
  range: string;
}

interface BarChartProps {
  data: BarChartData[];
  emptyMessage?: string;
  title?: string;
}

export function BarChart({ data, emptyMessage = 'No data', title }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const validData = useMemo(() => {
    return data.filter(item => item.workoutCount > 0);
  }, [data]);

  if (validData.length === 0) {
    return (
      <div className="flex items-center justify-center bg-solarized-base1/10 rounded-lg p-8">
        <span className="text-sm text-solarized-base01 text-center">
          {emptyMessage}
        </span>
      </div>
    );
  }

  const getPatternColor = (pattern: string) => {
    switch (pattern) {
      case 'Stable':
        return 'text-solarized-green bg-solarized-green/10 border-solarized-green/20';
      case 'Variable':
        return 'text-solarized-yellow bg-solarized-yellow/10 border-solarized-yellow/20';
      case 'Irregular':
        return 'text-solarized-red bg-solarized-red/10 border-solarized-red/20';
      default:
        return 'text-solarized-base01 bg-solarized-base1/10 border-solarized-base1/20';
    }
  };

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="text-md font-semibold text-solarized-base02 mb-3">{title}</h4>
      )}
      {validData.map((item, index) => {
        const barWidth = Math.min((item.value / item.maxValue) * 100, 100);
        const isHovered = hoveredIndex === index;

        return (
          <div
            key={index}
            className={`transition-all duration-200 ${isHovered ? 'bg-solarized-base1/30' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <span className="font-medium text-solarized-base02">{item.label}</span>
                <span className="text-sm text-solarized-base01 ml-2">
                  ({item.workoutCount} {item.workoutCount === 1 ? 'workout' : 'workouts'})
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getPatternColor(item.pattern)}`}>
                {item.pattern}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-solarized-base1/20 rounded-lg h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-300 hover:opacity-80"
                  style={{ 
                    width: `${barWidth}%`,
                    backgroundColor: item.color 
                  }}
                />
                <div className="absolute inset-0 flex items-center">
                  <span className="text-xs font-medium text-solarized-base02 ml-2">
                    {item.value} days median
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-solarized-base01 mt-1">
              Range: {item.range}
            </div>
          </div>
        );
      })}
    </div>
  );
}
