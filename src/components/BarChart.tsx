import React, { useMemo, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type TrendDirection = 'improving' | 'declining' | 'stable' | 'insufficient';

type ConsistencyPattern = 'Stable' | 'Variable' | 'Irregular';

interface TrendData {
  trend: TrendDirection;
  trendPercentage: number;
}

interface BarChartCategoryData {
  medianRestDays: number;
  workoutCount: number;
  pattern: ConsistencyPattern;
  range: string;
}

type BarChartData = Record<string, BarChartCategoryData>;

interface Category {
  value: string;
  label: string;
  bgColor: string;
}

interface BarChartProps {
  data: BarChartData;
  categories: Category[];
  trendData?: Record<string, TrendData>;
  title: string;
  emptyMessage: string;
}

export function BarChart({ data, categories, trendData, title, emptyMessage }: BarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const validCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.filter(category => {
      const item = data?.[category.value];
      return item && item.workoutCount >= 2;
    });
  }, [categories, data]);

  if (validCategories.length === 0) {
    return (
      <div className="flex items-center justify-center bg-solarized-base1/10 rounded-lg p-8">
        <span className="text-sm text-solarized-base01 text-center">
          {emptyMessage}
        </span>
      </div>
    );
  }

  const getPatternColor = (pattern: ConsistencyPattern) => {
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

  const safeMaxValue = useMemo(() => {
    const max = Math.max(
      ...validCategories.map(category => data[category.value]?.medianRestDays ?? 0),
      1
    );
    return max > 0 ? max : 1;
  }, [validCategories, data]);

  return (
    <div className="space-y-4">
      {title && (
        <h4 className="text-md font-semibold text-solarized-base02 mb-3">{title}</h4>
      )}
      {validCategories.map((category, index) => {
        const item = data[category.value];
        if (!item) return null;

        const value = item.medianRestDays;
        const barWidth = Math.min((value / safeMaxValue) * 100, 100);
        const isHovered = hoveredIndex === index;
        const workoutCount = item.workoutCount;
        const pattern = item.pattern;
        const range = item.range;
        const color = category.bgColor;
        const categoryTrend = trendData?.[category.value];

        return (
          <div
            key={category.value}
            className={`transition-all duration-200 ${isHovered ? 'bg-solarized-base1/30' : ''}`}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <span className="font-medium text-solarized-base02">{category.label}</span>
                <span className="text-sm text-solarized-base01 ml-2">
                  ({workoutCount} {workoutCount === 1 ? 'workout' : 'workouts'})
                </span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full border font-medium ${getPatternColor(pattern)}`}>
                {pattern}
              </span>
            </div>

            {categoryTrend && categoryTrend.trend !== 'insufficient' && (
              <div className="flex items-center justify-between mt-1">
                <span className="text-solarized-base01 text-xs">Trend:</span>
                <div className="flex items-center gap-1 min-w-[100px] justify-end">
                  {categoryTrend?.trend === 'improving' && (
                    <>
                      <TrendingUp size={14} className="text-solarized-green" />
                      <span className="text-solarized-green font-medium text-xs">
                        +{Math.round(categoryTrend.trendPercentage)}%
                      </span>
                    </>
                  )}
                  {categoryTrend?.trend === 'declining' && (
                    <>
                      <TrendingDown size={14} className="text-solarized-red" />
                      <span className="text-solarized-red font-medium text-xs">
                        -{Math.round(categoryTrend.trendPercentage)}%
                      </span>
                    </>
                  )}
                  {categoryTrend?.trend === 'stable' && (
                    <>
                      <Minus size={14} className="text-solarized-blue" />
                      <span className="text-solarized-blue font-medium text-xs">
                        Stable
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-2">
              <div className="flex-1 bg-solarized-base1/20 rounded-lg h-6 relative overflow-hidden">
                <div
                  className="h-full rounded-lg transition-all duration-300 hover:opacity-80"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: color
                  }}
                />
                <div className="absolute inset-0 flex items-center">
                  <span className="text-xs font-medium text-solarized-base02 ml-2">
                    {value} days median
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-solarized-base01 mt-1">Range: {range}</div>
          </div>
        );
      })}

      <div className="mt-3 p-2 bg-solarized-base1/10 rounded-lg text-xs">
        <p className="flex items-center gap-1 mb-1">
          <TrendingUp size={12} className="text-solarized-green" />
          <span className="text-solarized-green font-medium">Improving</span>
          <span>= More frequent workouts recently</span>
        </p>
        <p className="flex items-center gap-1 mb-1">
          <TrendingDown size={12} className="text-solarized-red" />
          <span className="text-solarized-red font-medium">Declining</span>
          <span>= Less frequent workouts recently</span>
        </p>
        <p className="flex items-center gap-1">
          <Minus size={12} className="text-solarized-blue" />
          <span className="text-solarized-blue font-medium">Stable</span>
          <span>= No change in workout frequency</span>
        </p>
      </div>
    </div>
  );
}
