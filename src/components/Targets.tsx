import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Target, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { WorkoutTarget, Exercise, Workout } from '../types';

interface TargetsProps {
  targets: WorkoutTarget[];
  exercises: Exercise[];
  workouts: Workout[];
  onAddTarget: (target: Omit<WorkoutTarget, 'id' | 'createdAt'>) => void;
  onEditTarget: (id: string, target: Omit<WorkoutTarget, 'id' | 'createdAt'>) => void;
  onDeleteTarget: (id: string) => void;
}

export function Targets({ targets, exercises, workouts, onAddTarget, onEditTarget, onDeleteTarget }: TargetsProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'sets' as 'sets' | 'reps',
    category: '' as string,
    exerciseId: '',
    targetValue: 10,
    period: 'weekly' as 'daily' | 'weekly' | 'monthly',
    isActive: true
  });

  const categories = [
    { value: 'abs', label: 'Abs', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    { value: 'legs', label: 'Legs', color: 'bg-green-100 text-green-800 border-green-200' },
    { value: 'arms', label: 'Arms', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { value: 'back', label: 'Back', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    { value: 'shoulders', label: 'Shoulders', color: 'bg-gray-100 text-gray-800 border-gray-200' },
    { value: 'chest', label: 'Chest', color: 'bg-pink-100 text-pink-800 border-pink-200' },
    { value: 'cardio', label: 'Cardio', color: 'bg-red-100 text-red-800 border-red-200' },
    { value: 'full-body', label: 'Full Body', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' }
  ];

  const sortedExercises = [...exercises].sort((a, b) => a.name.localeCompare(b.name));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.targetValue <= 0) return;

    const targetData = {
      name: formData.name.trim(),
      type: formData.type,
      category: formData.category || undefined,
      exerciseId: formData.exerciseId || undefined,
      targetValue: formData.targetValue,
      period: formData.period,
      isActive: formData.isActive
    };

    if (editingId) {
      onEditTarget(editingId, targetData);
      setEditingId(null);
    } else {
      onAddTarget(targetData);
    }

    setFormData({
      name: '',
      type: 'sets',
      category: '',
      exerciseId: '',
      targetValue: 10,
      period: 'weekly',
      isActive: true
    });
    setShowForm(false);
  };

  const handleEdit = (target: WorkoutTarget) => {
    setFormData({
      name: target.name,
      type: target.type,
      category: target.category || '',
      exerciseId: target.exerciseId || '',
      targetValue: target.targetValue,
      period: target.period,
      isActive: target.isActive
    });
    setEditingId(target.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      type: 'sets',
      category: '',
      exerciseId: '',
      targetValue: 10,
      period: 'weekly',
      isActive: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const calculateProgress = (target: WorkoutTarget) => {
    const now = new Date();
    let startDate: Date;
    
    switch (target.period) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        const currentDay = now.getDay();
        const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
        startDate = new Date(now);
        startDate.setDate(now.getDate() + mondayOffset);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
    }

    const relevantWorkouts = workouts.filter(workout => 
      new Date(workout.date) >= startDate && new Date(workout.date) <= now
    );

    let currentValue = 0;

    if (target.exerciseId) {
      // Specific exercise target
      relevantWorkouts.forEach(workout => {
        workout.sets.forEach(set => {
          if (set.exerciseId === target.exerciseId) {
            if (target.type === 'sets') {
              currentValue += 1;
            } else {
              currentValue += set.reps;
            }
          }
        });
      });
    } else if (target.category) {
      // Category target
      relevantWorkouts.forEach(workout => {
        workout.sets.forEach(set => {
          const exercise = exercises.find(ex => ex.id === set.exerciseId);
          if (exercise && exercise.category === target.category) {
            if (target.type === 'sets') {
              currentValue += 1;
            } else {
              currentValue += set.reps;
            }
          }
        });
      });
    }

    const percentage = Math.min((currentValue / target.targetValue) * 100, 100);
    const isCompleted = currentValue >= target.targetValue;
    const isExceeded = currentValue > target.targetValue;

    return { currentValue, percentage, isCompleted, isExceeded };
  };

  const getCategoryStyle = (category: string) => {
    return categories.find(c => c.value === category)?.color || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="p-6 pb-24 space-y-6 bg-solarized-base3 min-h-screen">
      {/* Add Target Button */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-solarized-blue text-solarized-base3 py-3 px-4 rounded-lg font-medium hover:bg-solarized-blue/90 transition-colors flex items-center justify-center gap-2 shadow-md"
      >
        <Plus size={20} />
        Add New Target
      </button>

      {/* Target Form */}
      {showForm && (
        <div className="bg-solarized-base2 rounded-xl p-6 shadow-lg border border-solarized-base1">
          <h3 className="text-lg font-semibold mb-4 text-solarized-base02">
            {editingId ? 'Edit Target' : 'Add New Target'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-solarized-base01 mb-2">
                Target Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02"
                placeholder="e.g., Weekly Abs Goal"
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-solarized-base01 mb-2">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'sets' | 'reps' })}
                  className="w-full p-3 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02"
                  required
                >
                  <option value="sets">Sets</option>
                  <option value="reps">Reps</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-solarized-base01 mb-2">
                  Period *
                </label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value as 'daily' | 'weekly' | 'monthly' })}
                  className="w-full p-3 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-solarized-base01 mb-2">
                Target Value *
              </label>
              <input
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: parseInt(e.target.value) || 0 })}
                className="w-full p-3 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-solarized-base01 mb-2">
                Category (optional)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, exerciseId: '' })}
                className="w-full p-3 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02"
              >
                <option value="">All categories</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {formData.category && (
              <div>
                <label className="block text-sm font-medium text-solarized-base01 mb-2">
                  Specific Exercise (optional)
                </label>
                <select
                  value={formData.exerciseId}
                  onChange={(e) => setFormData({ ...formData, exerciseId: e.target.value })}
                  className="w-full p-3 border border-solarized-base1 rounded-lg focus:ring-2 focus:ring-solarized-blue focus:border-transparent bg-solarized-base3 text-solarized-base02"
                >
                  <option value="">All {categories.find(c => c.value === formData.category)?.label.toLowerCase()} exercises</option>
                  {sortedExercises
                    .filter(ex => ex.category === formData.category)
                    .map(exercise => (
                      <option key={exercise.id} value={exercise.id}>
                        {exercise.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-solarized-blue text-solarized-base3 py-3 px-4 rounded-lg font-medium hover:bg-solarized-blue/90 transition-colors shadow-md"
              >
                {editingId ? 'Update Target' : 'Add Target'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-solarized-base1 text-solarized-base02 py-3 px-4 rounded-lg font-medium hover:bg-solarized-base0 transition-colors shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Targets List */}
      <div className="space-y-3">
        {targets.length === 0 ? (
          <div className="text-center py-12">
            <Target size={48} className="mx-auto text-solarized-base1 mb-4" />
            <p className="text-solarized-base01 mb-4">No targets set yet</p>
            <p className="text-sm text-solarized-base1">Create your first target to track your progress</p>
          </div>
        ) : (
          targets
            .filter(target => target.isActive)
            .map((target) => {
              const progress = calculateProgress(target);
              const exercise = target.exerciseId ? exercises.find(ex => ex.id === target.exerciseId) : null;
              
              return (
                <div key={target.id} className="bg-solarized-base2 rounded-xl p-4 shadow-lg border border-solarized-base1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-solarized-base02">{target.name}</h3>
                        {progress.isCompleted && (
                          <CheckCircle size={16} className={progress.isExceeded ? 'text-solarized-violet' : 'text-solarized-green'} />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-solarized-blue/10 text-solarized-blue border border-solarized-blue/20">
                          {target.period}
                        </span>
                        {target.category && (
                          <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryStyle(target.category)}`}>
                            {categories.find(c => c.value === target.category)?.label}
                          </span>
                        )}
                        {exercise && (
                          <span className="text-xs px-2 py-1 rounded-full bg-solarized-base1/20 text-solarized-base01 border border-solarized-base1/30">
                            {exercise.name}
                          </span>
                        )}
                      </div>

                      <div className="mb-2">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-solarized-base01">
                            {progress.currentValue} / {target.targetValue} {target.type}
                          </span>
                          <span className={`font-medium ${
                            progress.isExceeded ? 'text-solarized-violet' : 
                            progress.isCompleted ? 'text-solarized-green' : 
                            'text-solarized-base02'
                          }`}>
                            {Math.round(progress.percentage)}%
                          </span>
                        </div>
                        <div className="w-full bg-solarized-base1/20 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              progress.isExceeded ? 'bg-solarized-violet' :
                              progress.isCompleted ? 'bg-solarized-green' : 
                              'bg-solarized-blue'
                            }`}
                            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {progress.isExceeded && (
                        <p className="text-xs text-solarized-violet font-medium">
                          🎉 Target exceeded! Great job!
                        </p>
                      )}
                      {progress.isCompleted && !progress.isExceeded && (
                        <p className="text-xs text-solarized-green font-medium">
                          ✅ Target completed!
                        </p>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(target)}
                        className="p-2 text-solarized-base01 hover:text-solarized-blue hover:bg-solarized-blue/10 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteTarget(target.id)}
                        className="p-2 text-solarized-base01 hover:text-solarized-red hover:bg-solarized-red/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}