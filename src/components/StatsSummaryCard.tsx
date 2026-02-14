import {
    Calendar,
    BarChart3,
    Activity
} from 'lucide-react';
import { CategoryConsistencyStats, CategoryConsistencyTrend } from '../types/statsTypes';

interface StatsSummaryCardProps {
    date: Date;
    weekPercentage: number;
    monthPercentage: number;
    yearPercentage: number;
    weeklyData: Array<{ date: Date; sets: number; reps: number }>;
    yearlyTrainingData: Array<{ year: number; percentage: number; workoutDays: number; totalDays: number; isCurrent: boolean }>;
    categoryConsistencyStats: Record<string, CategoryConsistencyStats>;
    consistencyTrends: Record<string, CategoryConsistencyTrend>;
    categories: Array<{ value: string; label: string; color: string; bgColor: string }>;
    maxSets: number; // For weekly chart scaling
    maxYearlyPercentage: number; // For yearly chart scaling
}

export function StatsSummaryCard({
    date,
    weekPercentage,
    monthPercentage,
    yearPercentage,
    weeklyData,
    yearlyTrainingData,
    categoryConsistencyStats,
    categories,
    maxSets,
    maxYearlyPercentage
}: StatsSummaryCardProps) {
    return (
        <div id="stats-summary-card" className="bg-solarized-base3 p-8 w-[600px] mx-auto space-y-8 border border-solarized-base1">
            {/* Header */}
            <div className="text-center space-y-2 border-b border-solarized-base1 pb-6">
                <h1 className="text-3xl font-bold text-solarized-base02">Workout Stats Summary</h1>
                <p className="text-solarized-base01">Generated on {date.toLocaleDateString()}</p>
            </div>

            {/* Training Overview */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-solarized-blue/10 p-4 rounded-xl border border-solarized-blue/20 text-center">
                    <div className="text-xs font-medium text-solarized-base01 uppercase mb-1">Weekly</div>
                    <div className="text-2xl font-bold text-solarized-blue">{weekPercentage}%</div>
                </div>
                <div className="bg-solarized-green/10 p-4 rounded-xl border border-solarized-green/20 text-center">
                    <div className="text-xs font-medium text-solarized-base01 uppercase mb-1">Monthly</div>
                    <div className="text-2xl font-bold text-solarized-green">{monthPercentage}%</div>
                </div>
                <div className="bg-solarized-violet/10 p-4 rounded-xl border border-solarized-violet/20 text-center">
                    <div className="text-xs font-medium text-solarized-base01 uppercase mb-1">Yearly</div>
                    <div className="text-2xl font-bold text-solarized-violet">{yearPercentage}%</div>
                </div>
            </div>

            {/* Yearly Training */}
            <div>
                <h3 className="text-lg font-semibold text-solarized-base02 mb-4 flex items-center gap-2">
                    <BarChart3 size={20} className="text-solarized-green" />
                    Training Days by Year
                </h3>
                <div className="space-y-3">
                    {yearlyTrainingData.map((data, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-12 text-sm text-solarized-base01 font-medium">{data.year}</div>
                            <div className="flex-1 bg-solarized-base1/20 rounded-full h-6 relative overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${data.isCurrent ? 'bg-solarized-blue' : 'bg-solarized-green'}`}
                                    style={{ width: `${(data.percentage / maxYearlyPercentage) * 100}%` }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-solarized-base02">{data.percentage}%</span>
                                </div>
                            </div>
                            <div className="w-24 text-xs text-solarized-base01 text-right">{data.workoutDays} days</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weekly Activity */}
            <div>
                <h3 className="text-lg font-semibold text-solarized-base02 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-solarized-blue" />
                    Last 7 Days
                </h3>
                <div className="space-y-2">
                    {weeklyData.map((day, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-24 text-sm text-solarized-base01">
                                {day.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                            </div>
                            <div className="flex-1 bg-solarized-base1/20 rounded-full h-4 relative overflow-hidden">
                                {day.sets > 0 && (
                                    <div
                                        className="bg-solarized-blue h-full rounded-full"
                                        style={{ width: `${Math.min((day.sets / maxSets) * 100, 100)}%` }}
                                    />
                                )}
                            </div>
                            <div className="w-16 text-xs text-solarized-base01 text-right">
                                {day.sets > 0 ? `${day.sets} sets` : '-'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Consistency Matrix */}
            <div>
                <h3 className="text-lg font-semibold text-solarized-base02 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-solarized-orange" />
                    Consistency
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {categories.map(category => {
                        const stats = categoryConsistencyStats[category.value];
                        if (!stats || stats.workoutCount < 2) return null;

                        return (
                            <div key={category.value} className="bg-solarized-base2 p-3 rounded-lg border border-solarized-base1">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-solarized-base02">{category.label}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${stats.pattern === 'Stable' ? 'bg-solarized-green/20 text-solarized-green' :
                                            stats.pattern === 'Variable' ? 'bg-solarized-yellow/20 text-solarized-yellow' :
                                                'bg-solarized-red/20 text-solarized-red'
                                        }`}>
                                        {stats.pattern}
                                    </span>
                                </div>
                                <div className="text-sm text-solarized-base01">
                                    Avg Rest: {stats.medianRestDays} days
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-solarized-base1 text-center text-solarized-base1 text-sm">
                Tracked with Workout Logger
            </div>
        </div>
    );
}
