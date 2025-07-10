import React, { useState, useEffect } from 'react';
import { Plus, Minus, Save, RotateCcw, BookOpen, Trophy, TrendingUp, Star, X } from 'lucide-react';
import { Exercise, WorkoutSet, Workout, WorkoutTemplate } from '../types';
import { formatDate, isToday } from '../utils/dateUtils';
import { getExerciseMaxReps, getExerciseAverageReps } from '../utils/maxRepUtils';

interface WorkoutLoggerProps {
  exercises: Exercise[];
  todaysWorkout: Workout | null;
  workouts: Workout[];
  templates: WorkoutTemplate[];
  onSaveWorkout: (workout: Omit<Workout, 'id'>) => void;
  onUpdateWorkout: (id: string, workout: Omit<Workout, 'id'>) => void;
  onAddTemplate?: (template: Omit<WorkoutTemplate, 'id' | 'createdAt'>) => void;
  onWorkoutDataChange?: (sets: Array<{ exerciseId: string; reps: number }>, notes: string) => void;
}

export function WorkoutLogger({ 
  exercises, 
  todaysWorkout, 
  workouts,
  templates,
  onSaveWorkout, 
  onUpdateWorkout,
  onAddTemplate,
  onWorkoutDataChange
}: WorkoutLoggerProps) {
  const [sets, setSets] = useState<Omit<WorkoutSet, 'id'>[]>([]);
  const [notes, setNotes] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Exercise['category'] | 'all'>('all');
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [numberOfSets, setNumberOfSets] = useState(3);

  const categories = [
    { value: 'abs', label: 'Abs', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'arms', label: 'Arms', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'back', label: 'Back', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'cardio', label: 'Cardio', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'chest', label: 'Chest', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { value: 'full-body', label: 'Full Body', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { value: 'legs', label: 'Legs', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'shoulders', label: 'Shoulders', color: 'bg-gray-100 text-gray-800 border-gray-200' }
  ].sort((a, b) => a.label.localeCompare(b.label));

  // Sort exercises alphabetically
  const sortedExercises = [...exercises].sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    if (todaysWorkout) {
      setSets(todaysWorkout.sets.map(set => ({
        exerciseId: set.exerciseId,
        reps: set.reps
      })));
      setNotes(todaysWorkout.notes || '');
    }
  }, [todaysWorkout]);

  useEffect(() => {
    if (sortedExercises.length > 0 && !selectedExerciseId) {
      setSelectedExerciseId(sortedExercises[0].id);
    }
  }, [sortedExercises, selectedExerciseId]);

  // Notify parent component when workout data changes (for autosave)
  useEffect(() => {
    if (onWorkoutDataChange) {
      onWorkoutDataChange(sets, notes);
    }
  }, [sets, notes, onWorkoutDataChange]);

  const addExerciseWithSets = () => {
    if (!selectedExerciseId || numberOfSets < 1) return;
    
    const newSets: Omit<WorkoutSet, 'id'>[] = [];
    for (let i = 0; i < numberOfSets; i++) {
      newSets.push({ exerciseId: selectedExerciseId, reps: 0 });
    }
    
    setSets([...sets, ...newSets]);
    setShowAddExercise(false);
    setNumberOfSets(3);
  };

  const addSingleSet = (exerciseId?: string) => {
    const defaultExerciseId = exerciseId || 
      (selectedCategory !== 'all' 
        ? sortedExercises.find(e => e.category === selectedCategory)?.id 
        : sortedExercises[0]?.id) || '';
    
    setSets([...sets, { exerciseId: defaultExerciseId, reps: 0 }]);
  };

  const updateSet = (index: number, field: keyof Omit<WorkoutSet, 'id'>, value: any) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (sets.length === 0) return;

    const workout: Omit<Workout, 'id'> = {
      date: new Date(),
      sets: sets.map(set => ({
        ...set,
        id: crypto.randomUUID()
      })),
      notes: notes.trim() || undefined
    };

    if (todaysWorkout) {
      onUpdateWorkout(todaysWorkout.id, workout);
    } else {
      onSaveWorkout(workout);
    }

    // Reset form
    setSets([]);
    setNotes('');
  };

  const resetWorkout = () => {
    setSets([]);
    setNotes('');
  };

  const useTemplate = (template: WorkoutTemplate) => {
    const templateSets: Omit<WorkoutSet, 'id'>[] = [];
    template.exercises.forEach(templateExercise => {
      for (let i = 0; i < templateExercise.sets; i++) {
        templateSets.push({
          exerciseId: templateExercise.exerciseId,
          reps: 0
        });
      }
    });
    
    setSets(templateSets);
    setShowTemplates(false);
  };

  const handleSaveAsTemplate = () => {
    if (!templateName.trim() || sets.length === 0 || !onAddTemplate) return;

    // Group sets by exercise and count them
    const exerciseCounts = new Map<string, number>();
    sets.forEach(set => {
      exerciseCounts.set(set.exerciseId, (exerciseCounts.get(set.exerciseId) || 0) + 1);
    });

    // Convert to template format
    const templateExercises = Array.from(exerciseCounts.entries()).map(([exerciseId, count]) => ({
      exerciseId,
      sets: count
    }));

    onAddTemplate({
      name: templateName.trim(),
      exercises: templateExercises
    });

    setTemplateName('');
    setShowSaveTemplate(false);
  };

  const getStatsForSet = (exerciseId: string, setPosition: number) => {
    const threeMonthMax = getExerciseMaxReps(workouts, exerciseId, '3months');
    const threeMonthAvg = getExerciseAverageReps(workouts, exerciseId, '3months');
    
    const threeMonthMaxRecord = threeMonthMax.find(record => record.setPosition === setPosition);
    const threeMonthAvgRecord = threeMonthAvg.find(record => record.setPosition === setPosition);
    
    return {
      max: threeMonthMaxRecord?.maxReps || 0,
      average: threeMonthAvgRecord?.averageReps || 0
    };
  };

  const getSetPositionForExercise = (exerciseId: string, currentIndex: number) => {
    // Count how many sets of this exercise come before the current index
    let position = 1;
    for (let i = 0; i < currentIndex; i++) {
      if (sets[i].exerciseId === exerciseId) {
        position++;
      }
    }
    return position;
  };

  const getExerciseSetNumber = (exerciseId: string, currentIndex: number) => {
    // Count how many sets of this specific exercise come before the current index
    let setNumber = 1;
    for (let i = 0; i < currentIndex; i++) {
      if (sets[i].exerciseId === exerciseId) {
        setNumber++;
      }
    }
    return setNumber;
  };

  const getCategoryStyle = (category: Exercise['category']) => {
    return categories.find(c => c.value === category)?.color || 'bg-solarized-base1/10 text-solarized-base01 border-solarized-base1/20';
  };

  const getPlaceholderText = (exerciseId: string, setPosition: number) => {
    const stats = getStatsForSet(exerciseId, setPosition);
    const parts = [];
    
    if (stats.max > 0) {
      parts.push(`max ${stats.max}`);
    }
    if (stats.average > 0) {
      parts.push(`avg ${stats.average}`);
    }
    
    return parts.length > 0 ? parts.join(' / ') : 'Enter reps';
  };

  const incrementSets = () => {
    setNumberOfSets(prev => Math.min(prev + 1, 10));
  };

  const decrementSets = () => {
    setNumberOfSets(prev => Math.max(prev - 1, 1));
  };

  const filteredExercises = selectedCategory === 'all' 
    ? sortedExercises 
    : sortedExercises.filter(ex => ex.category === selectedCategory);

  // Group consecutive sets by exercise
  const groupedSets = () => {
    const groups: Array<{
      exerciseId: string;
      exercise: Exercise | undefined;
      sets: Array<{ set: Omit<WorkoutSet, 'id'>; originalIndex: number; setNumber: number }>;
    }> = [];

    let currentGroup: typeof groups[0] | null = null;
    let exerciseSetCounts = new Map<string, number>();

    sets.forEach((set, index) => {
      const exercise = sortedExercises.find(e => e.id === set.exerciseId);
      const setNumber = (exerciseSetCounts.get(set.exerciseId) || 0) + 1;
      exerciseSetCounts.set(set.exerciseId, setNumber);

      if (!currentGroup || currentGroup.exerciseId !== set.exerciseId) {
        // Start a new group
        currentGroup = {
          exerciseId: set.exerciseId,
          exercise,
          sets: []
        };
        groups.push(currentGroup);
      }

      currentGroup.sets.push({ set, originalIndex: index, setNumber });
    });

    return groups;
  };

  if (sortedExercises.length === 0) {
    return (
      <div className="p-4 pb-24 bg-solarized-base3 min-h-screen">
        <div className="text-center py-12">
          <p className="text-solarized-base01 mb-4">No exercises available</p>
          <p className="text-sm text-solarized-base1">Add some exercises first to start logging workouts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-solarized-base3 min-h-screen">
      {/* iOS-style Header */}
      <div className="bg-solarized-base3 pt-safe-top">
        <div className="px-4 py-3 border-b border-solarized-base2">
          <h1 className="text-lg font-semibold text-solarized-base02 text-center">
            {formatDate(new Date())}
          </h1>
          {todaysWorkout && (
            <p className="text-xs text-solarized-green text-center mt-1">
              Workout already logged today
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-24 space-y-3">
        {/* Compact Action Buttons */}
        <div className="flex gap-2 py-3">
          <button
            onClick={() => setShowTemplates(!showTemplates)}
            className="flex-1 bg-solarized-violet text-solarized-base3 py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-solarized-violet/90 transition-colors flex items-center justify-center gap-1.5"
          >
            <BookOpen size={16} />
            Templates
          </button>
          
          {sets.length > 0 && onAddTemplate && (
            <button
              onClick={() => setShowSaveTemplate(!showSaveTemplate)}
              className="flex-1 bg-solarized-yellow text-solarized-base3 py-2.5 px-3 rounded-lg text-sm font-medium hover:bg-solarized-yellow/90 transition-colors flex items-center justify-center gap-1.5"
            >
              <Star size={16} />
              Save Template
            </button>
          )}
        </div>

        {/* Template Selection - iOS Card Style */}
        {showTemplates && (
          <div className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
            <h4 className="font-medium text-solarized-base02 mb-2 text-sm">Choose Template</h4>
            {templates.length === 0 ? (
              <p className="text-solarized-base01 text-xs py-2">No templates available</p>
            ) : (
              <div className="space-y-1">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => useTemplate(template)}
                    className="w-full text-left p-2.5 bg-solarized-base3 rounded-lg hover:bg-solarized-violet/10 border border-solarized-base1 hover:border-solarized-violet/20 transition-colors"
                  >
                    <div className="font-medium text-solarized-base02 text-sm">{template.name}</div>
                    <div className="text-xs text-solarized-base01">
                      {template.exercises.length} exercises • {template.exercises.reduce((total, ex) => total + ex.sets, 0)} sets
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Save Template - iOS Card Style */}
        {showSaveTemplate && (
          <div className="bg-solarized-yellow/10 rounded-xl p-3 border border-solarized-yellow/20">
            <h4 className="font-medium text-solarized-base02 mb-2 text-sm">Save as Template</h4>
            <div className="space-y-2">
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template name"
                className="w-full p-2.5 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-yellow focus:border-transparent bg-solarized-base3 text-solarized-base02 text-sm"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveAsTemplate}
                  disabled={!templateName.trim()}
                  className="flex-1 bg-solarized-yellow text-solarized-base3 py-2 px-3 rounded-lg text-sm font-medium hover:bg-solarized-yellow/90 transition-colors disabled:bg-solarized-base1 disabled:cursor-not-allowed disabled:text-solarized-base01"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowSaveTemplate(false);
                    setTemplateName('');
                  }}
                  className="flex-1 bg-solarized-base1 text-solarized-base02 py-2 px-3 rounded-lg text-sm font-medium hover:bg-solarized-base0 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compact Exercise Groups */}
        {groupedSets().map((group, groupIndex) => (
          <div key={`${group.exerciseId}-${groupIndex}`} className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
            {/* Compact Exercise Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <h3 className="font-medium text-solarized-base02 text-sm truncate">
                  {group.exercise?.name || 'Unknown Exercise'}
                </h3>
                {group.exercise && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getCategoryStyle(group.exercise.category)}`}>
                    {categories.find(c => c.value === group.exercise!.category)?.label}
                  </span>
                )}
              </div>
              <span className="text-xs text-solarized-base01 bg-solarized-base1/20 px-2 py-0.5 rounded-full flex-shrink-0">
                {group.sets.length}
              </span>
            </div>

            {/* Compact Sets Grid */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {group.sets.map(({ set, originalIndex, setNumber }) => {
                const setPosition = getSetPositionForExercise(set.exerciseId, originalIndex);
                
                return (
                  <div key={originalIndex} className="bg-solarized-base1/10 rounded-lg p-2 border border-solarized-base1/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-solarized-base02">
                        Set {setNumber}
                      </span>
                      <button
                        onClick={() => removeSet(originalIndex)}
                        className="p-0.5 text-solarized-red hover:bg-solarized-red/10 rounded"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    
                    <input
                      type="number"
                      value={set.reps || ''}
                      onChange={(e) => updateSet(originalIndex, 'reps', parseInt(e.target.value) || 0)}
                      placeholder={getPlaceholderText(set.exerciseId, setPosition)}
                      className="w-full p-2 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent text-lg font-bold bg-solarized-base3 text-solarized-base02 placeholder-gray-400 placeholder:text-xs text-center"
                      min="0"
                    />
                  </div>
                );
              })}
            </div>

            {/* Add Set Button */}
            <button
              onClick={() => addSingleSet(group.exerciseId)}
              className="w-full bg-solarized-base1/30 text-solarized-base01 py-2 px-3 rounded-lg text-sm font-medium hover:bg-solarized-base1/50 transition-colors flex items-center justify-center gap-1"
            >
              <Plus size={14} />
              Add Set
            </button>
          </div>
        ))}

        {/* Compact Add Exercise */}
        {!showAddExercise ? (
          <button
            onClick={() => setShowAddExercise(true)}
            className="w-full bg-solarized-blue text-solarized-base3 py-3 px-4 rounded-xl font-medium hover:bg-solarized-blue/90 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Exercise
          </button>
        ) : (
          <div className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-solarized-base01 mb-1">
                  Exercise
                </label>
                <select
                  value={selectedExerciseId}
                  onChange={(e) => setSelectedExerciseId(e.target.value)}
                  className="w-full p-2.5 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02 text-sm"
                >
                  {categories.map(category => {
                    const categoryExercises = sortedExercises.filter(ex => ex.category === category.value);
                    if (categoryExercises.length === 0) return null;
                    
                    return (
                      <optgroup key={category.value} label={category.label}>
                        {categoryExercises.map(exercise => (
                          <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-solarized-base01 mb-1">
                  Sets
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={decrementSets}
                    className="bg-solarized-base1/30 text-solarized-base01 p-2 rounded-lg hover:bg-solarized-base1/50 transition-colors"
                  >
                    <Minus size={14} />
                  </button>
                  <input
                    type="number"
                    value={numberOfSets}
                    onChange={(e) => setNumberOfSets(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="flex-1 p-2.5 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02 text-center text-sm"
                    min="1"
                    max="10"
                  />
                  <button
                    type="button"
                    onClick={incrementSets}
                    className="bg-solarized-base1/30 text-solarized-base01 p-2 rounded-lg hover:bg-solarized-base1/50 transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={addExerciseWithSets}
                  disabled={!selectedExerciseId || numberOfSets < 1}
                  className="flex-1 bg-solarized-green text-solarized-base3 py-2 px-3 rounded-lg text-sm font-medium hover:bg-solarized-green/90 transition-colors disabled:bg-solarized-base1 disabled:cursor-not-allowed disabled:text-solarized-base01"
                >
                  Add {numberOfSets} Set{numberOfSets !== 1 ? 's' : ''}
                </button>
                <button
                  onClick={() => setShowAddExercise(false)}
                  className="flex-1 bg-solarized-base1 text-solarized-base02 py-2 px-3 rounded-lg text-sm font-medium hover:bg-solarized-base0 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Compact Notes */}
        <div className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
          <label className="block text-xs font-medium text-solarized-base01 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2.5 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02 text-sm"
            placeholder="How was your workout?"
            rows={2}
          />
        </div>

        {/* Compact Action Buttons */}
        {sets.length > 0 && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-solarized-green text-solarized-base3 py-3 px-4 rounded-xl font-medium hover:bg-solarized-green/90 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              {todaysWorkout ? 'Update' : 'Save'}
            </button>
            <button
              onClick={resetWorkout}
              className="bg-solarized-base1 text-solarized-base02 px-4 py-3 rounded-xl hover:bg-solarized-base0 transition-colors"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}