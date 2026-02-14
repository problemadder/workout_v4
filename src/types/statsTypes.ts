
export type ConsistencyPattern = 'Stable' | 'Variable' | 'Irregular';

export interface CategoryConsistencyStats {
    medianRestDays: number;
    workoutCount: number;
    pattern: ConsistencyPattern;
    range: string;
}

export interface CategoryConsistencyTrend {
    recentMedian: number;
    pastMedian: number;
    trend: 'improving' | 'declining' | 'stable' | 'insufficient';
    trendPercentage: number;
}
