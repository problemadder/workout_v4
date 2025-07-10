import React from 'react';
import { Calendar, Target, TrendingUp, Percent, Play } from 'lucide-react';
import { Workout, WorkoutStats } from '../types';
import { formatDate, isToday, getDaysAgo } from '../utils/dateUtils';

interface DashboardProps {
  workouts: Workout[];
  stats: WorkoutStats;
  onStartWorkout: () => void;
}

export function Dashboard({ workouts, stats, onStartWorkout }: DashboardProps) {
  const todaysWorkout = workouts.find(w => isToday(new Date(w.date)));
  const lastWorkout = workouts[0];
  const lastWorkoutDays = lastWorkout ? getDaysAgo(new Date(lastWorkout.date)) : null;

  // Calculate current week percentage (Monday to Sunday)
  const getCurrentWeekPercentage = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Get Monday of current week
    const monday = new Date(now);
    monday.setDate(now.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    const daysInWeek = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      daysInWeek.push(day);
    }

    const workoutDays = daysInWeek.filter(day => 
      workouts.some(workout => 
        new Date(workout.date).toDateString() === day.toDateString()
      )
    ).length;

    // Only count days up to today
    const today = new Date();
    const daysPassedThisWeek = daysInWeek.filter(day => day <= today).length;
    
    return Math.round((workoutDays / daysPassedThisWeek) * 100);
  };

  // Calculate current month percentage
  const getCurrentMonthPercentage = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const today = new Date();
    
    const daysInMonth = [];
    const currentDate = new Date(firstDayOfMonth);
    
    while (currentDate <= today) {
      daysInMonth.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const workoutDays = daysInMonth.filter(day => 
      workouts.some(workout => 
        new Date(workout.date).toDateString() === day.toDateString()
      )
    ).length;

    return Math.round((workoutDays / daysInMonth.length) * 100);
  };

  // Calculate current year percentage
  const getCurrentYearPercentage = () => {
    const now = new Date();
    const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
    const today = new Date();
    
    const daysInYear = [];
    const currentDate = new Date(firstDayOfYear);
    
    while (currentDate <= today) {
      daysInYear.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const workoutDays = daysInYear.filter(day => 
      workouts.some(workout => 
        new Date(workout.date).toDateString() === day.toDateString()
      )
    ).length;

    return Math.round((workoutDays / daysInYear.length) * 100);
  };

  const weekPercentage = getCurrentWeekPercentage();
  const monthPercentage = getCurrentMonthPercentage();
  const yearPercentage = getCurrentYearPercentage();

  return (
    <div className="bg-solarized-base3 min-h-screen">
      {/* iOS-style Header */}
      <div className="bg-solarized-base3 pt-safe-top">
        <div className="px-4 py-3 border-b border-solarized-base2">
          <h1 className="text-lg font-semibold text-solarized-base02 text-center">
            Dashboard
          </h1>
        </div>
      </div>

      <div className="px-4 pb-24 space-y-3 pt-3">
        {/* Compact Training Percentages */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gradient-to-br from-solarized-blue to-solarized-cyan text-solarized-base3 p-3 rounded-xl">
            <div className="flex items-center gap-1 mb-1">
              <Percent size={14} />
              <span className="text-xs font-medium">Week</span>
            </div>
            <p className="text-xl font-bold">{weekPercentage}%</p>
          </div>
          
          <div className="bg-gradient-to-br from-solarized-green to-solarized-cyan text-solarized-base3 p-3 rounded-xl">
            <div className="flex items-center gap-1 mb-1">
              <Target size={14} />
              <span className="text-xs font-medium">Month</span>
            </div>
            <p className="text-xl font-bold">{monthPercentage}%</p>
          </div>

          <div className="bg-gradient-to-br from-solarized-violet to-solarized-magenta text-solarized-base3 p-3 rounded-xl">
            <div className="flex items-center gap-1 mb-1">
              <Calendar size={14} />
              <span className="text-xs font-medium">Year</span>
            </div>
            <p className="text-xl font-bold">{yearPercentage}%</p>
          </div>
        </div>

        {/* Compact Today's Status */}
        <div className="bg-solarized-base2 rounded-xl p-4 border border-solarized-base1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-solarized-base02">Today</h2>
            <Calendar size={16} className="text-solarized-blue" />
          </div>
          
          {todaysWorkout ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-solarized-green rounded-full"></div>
                <span className="text-solarized-green font-medium text-sm">Completed!</span>
              </div>
              <div className="bg-solarized-green/10 p-2.5 rounded-lg border border-solarized-green/20">
                <p className="text-xs text-solarized-base02">
                  {todaysWorkout.sets.length} sets • {todaysWorkout.sets.reduce((total, set) => total + set.reps, 0)} reps
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-solarized-base01 rounded-full"></div>
                <span className="text-solarized-base01 text-sm">Ready to start</span>
              </div>
              <button
                onClick={onStartWorkout}
                className="w-full bg-solarized-blue text-solarized-base3 py-2.5 px-4 rounded-lg font-medium hover:bg-solarized-blue/90 transition-colors flex items-center justify-center gap-2"
              >
                <Play size={16} />
                Start Workout
              </button>
            </div>
          )}
        </div>

        {/* Compact Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
            <div className="text-center">
              <div className="text-lg font-bold text-solarized-base02">{stats.currentStreak}</div>
              <div className="text-xs text-solarized-base01">Current Streak</div>
            </div>
          </div>
          
          <div className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
            <div className="text-center">
              <div className="text-lg font-bold text-solarized-base02">{stats.longestStreak}</div>
              <div className="text-xs text-solarized-base01">Best Streak</div>
            </div>
          </div>
          
          <div className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
            <div className="text-center">
              <div className="text-lg font-bold text-solarized-base02">{stats.totalWorkouts}</div>
              <div className="text-xs text-solarized-base01">Total Workouts</div>
            </div>
          </div>
          
          <div className="bg-solarized-base2 rounded-xl p-3 border border-solarized-base1">
            <div className="text-center">
              <div className="text-lg font-bold text-solarized-base02">{stats.totalReps.toLocaleString()}</div>
              <div className="text-xs text-solarized-base01">Total Reps</div>
            </div>
          </div>
        </div>

        {/* Compact Recent Activity */}
        <div className="bg-solarized-base2 rounded-xl p-4 border border-solarized-base1">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-solarized-base02">Recent</h2>
            <TrendingUp size={16} className="text-solarized-blue" />
          </div>
          
          {workouts.length > 0 ? (
            <div className="space-y-2">
              {workouts.slice(0, 3).map((workout) => (
                <div key={workout.id} className="flex items-center justify-between py-1.5">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-solarized-base02 text-sm truncate">
                      {formatDate(new Date(workout.date))}
                    </p>
                    <p className="text-xs text-solarized-base01">
                      {workout.sets.length} sets • {workout.sets.reduce((total, set) => total + set.reps, 0)} reps
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-solarized-base01 mb-2 text-sm">No workouts yet</p>
              <button
                onClick={onStartWorkout}
                className="bg-solarized-blue text-solarized-base3 py-2 px-3 rounded-lg font-medium hover:bg-solarized-blue/90 transition-colors text-sm"
              >
                Start First Workout
              </button>
            </div>
          )}
        </div>

        {/* Last Workout Info */}
        {lastWorkout && lastWorkoutDays !== null && (
          <div className="bg-solarized-blue/10 p-3 rounded-xl border border-solarized-blue/20">
            <p className="text-xs text-solarized-base02 text-center">
              Last workout: {lastWorkoutDays === 0 ? 'today' : 
                            lastWorkoutDays === 1 ? 'yesterday' : 
                            `${lastWorkoutDays} days ago`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}