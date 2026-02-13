import { Exercise } from '../types';

/**
 * Migrates exercises to ensure they have a valid exerciseType.
 * Defaults to 'reps' if missing.
 * @param exercises - Array of exercises to migrate
 * @returns Migrated array of exercises
 */
export function migrateExercises(exercises: Exercise[]): Exercise[] {
    return exercises.map(exercise => ({
        ...exercise,
        exerciseType: exercise.exerciseType || 'reps'
    }));
}
