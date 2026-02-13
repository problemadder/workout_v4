export interface Exercise {
  id: string;
  name: string;
  description?: string;
  category: 'abs' | 'legs' | 'arms' | 'back' | 'shoulders' | 'chest' | 'cardio' | 'full-body';
  exerciseType?: 'reps' | 'time';
  createdAt: Date;
}

export interface WorkoutSet {
  id: string;
  exerciseId: string;
  reps: number;
  duration?: string;
  notes?: string;
  completedAt?: Date;
}

export interface Workout {
  id: string;
  date: Date;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: {
    exerciseId: string;
    sets: number; // number of sets for this exercise
  }[];
  createdAt: Date;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  totalDuration?: number;
  currentStreak: number;
  longestStreak: number;
}

export interface WorkoutTarget {
  id: string;
  name: string;
  type: 'sets' | 'reps' | 'duration';
  category?: Exercise['category'];
  exerciseId?: string;
  targetValue: number;
  period: 'weekly' | 'monthly' | 'yearly';
  isActive: boolean;
  createdAt: Date;
}

export interface MaxRepRecord {
  exerciseId: string;
  setPosition: number; // 1st set, 2nd set, etc.
  maxReps: number;
  date: Date;
}

export interface AverageRepRecord {
  exerciseId: string;
  setPosition: number;
  averageReps: number;
  totalSets: number;
}