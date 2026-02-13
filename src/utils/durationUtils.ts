/**
 * Validates a duration string in MM:SS format
 * @param duration - The duration string to validate
 * @returns true if valid, false otherwise
 */
export function validateDuration(duration: string): boolean {
  if (!duration) return false;

  const regex = /^(\d{1,2}):([0-5]\d)$/;
  const match = duration.match(regex);

  if (!match) return false;

  const minutes = parseInt(match[1], 10);
  const seconds = parseInt(match[2], 10);

  return minutes >= 0 && minutes <= 99 && seconds >= 0 && seconds <= 59;
}

/**
 * Converts a duration string (MM:SS) to total seconds
 * @param duration - The duration string in MM:SS format
 * @returns Total seconds, or 0 if invalid
 */
export function durationToSeconds(duration: string): number {
  if (!validateDuration(duration)) return 0;

  const [minutes, seconds] = duration.split(':').map(s => parseInt(s, 10));
  return minutes * 60 + seconds;
}

/**
 * Converts total seconds to a duration string (MM:SS)
 * @param seconds - Total seconds
 * @returns Duration string in MM:SS format
 */
export function secondsToDuration(seconds: number): string {
  if (seconds < 0) return '00:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a duration string to ensure MM:SS format with zero-padding
 * @param duration - The duration string to format
 * @returns Formatted duration string or empty string if invalid
 */
export function formatDuration(duration: string): string {
  if (!duration) return '';

  const cleaned = duration.replace(/[^\d:]/g, '');

  if (cleaned.includes(':')) {
    const parts = cleaned.split(':');
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10) || 0;
      const seconds = parseInt(parts[1], 10) || 0;

      if (minutes >= 0 && minutes <= 99 && seconds >= 0 && seconds <= 59) {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }
  } else if (cleaned.length > 0) {
    const num = parseInt(cleaned, 10) || 0;
    const minutes = Math.floor(num / 100);
    const seconds = num % 100;

    if (minutes >= 0 && minutes <= 99 && seconds >= 0 && seconds <= 59) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  return '';
}

/**
 * Parses user input and converts to MM:SS format
 * Handles various input formats (MM:SS, MMSS, raw numbers)
 * @param input - The user input string
 * @returns Formatted duration or empty string if invalid
 */
export function parseDurationInput(input: string): string {
  if (!input) return '';

  const cleaned = input.replace(/[^\d:]/g, '');

  if (cleaned.includes(':')) {
    return formatDuration(cleaned);
  }

  if (cleaned.length <= 2) {
    const seconds = parseInt(cleaned, 10) || 0;
    if (seconds <= 59) {
      return `00:${seconds.toString().padStart(2, '0')}`;
    }
  } else if (cleaned.length === 3) {
    const minutes = parseInt(cleaned[0], 10);
    const seconds = parseInt(cleaned.slice(1), 10);
    if (seconds <= 59) {
      return `0${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  } else if (cleaned.length === 4) {
    const minutes = parseInt(cleaned.slice(0, 2), 10);
    const seconds = parseInt(cleaned.slice(2), 10);
    if (minutes <= 99 && seconds <= 59) {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  }

  return formatDuration(cleaned);
}

/**
 * Formats total seconds into a display-friendly format (HH:MM:SS or MM:SS)
 * @param seconds - Total seconds
 * @returns Formatted display string
 */
export function formatDurationDisplay(seconds: number): string {
  if (seconds < 0) return '00:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a duration string for compact display (removes leading zeros)
 * @param duration - Duration string in MM:SS format
 * @returns Compact display string
 */
export function formatDurationShort(duration: string): string {
  if (!validateDuration(duration)) return duration;

  const [minutes, seconds] = duration.split(':');
  const m = parseInt(minutes, 10);
  const s = parseInt(seconds, 10);

  if (m === 0) {
    return `${s}s`;
  }

  return `${m}:${seconds}`;
}

/**
 * Sums an array of duration strings to total seconds
 * @param durations - Array of duration strings in MM:SS format
 * @returns Total seconds
 */
export function sumDurations(durations: string[]): number {
  if (!durations || durations.length === 0) return 0;
  return durations.reduce((total, duration) => {
    return total + durationToSeconds(duration);
  }, 0);
}

/**
 * Calculates the average duration from an array of duration strings
 * @param durations - Array of duration strings in MM:SS format
 * @returns Average duration as MM:SS string
 */
export function averageDuration(durations: string[]): string {
  if (!durations || durations.length === 0) return '00:00';
  const totalSeconds = sumDurations(durations);
  const avgSeconds = Math.round(totalSeconds / durations.length);
  return formatDurationDisplay(avgSeconds);
}

/**
 * Calculates the maximum duration from an array of duration strings
 * @param durations - Array of duration strings in MM:SS format
 * @returns Maximum duration as MM:SS string
 */
export function maxDuration(durations: string[]): string {
  if (!durations || durations.length === 0) return '00:00';
  const maxSeconds = Math.max(...durations.map(d => durationToSeconds(d)));
  return formatDurationDisplay(maxSeconds);
}

/**
 * Formats total seconds into a display string with appropriate units
 * Shows as HH:MM:SS if > 60 mins, otherwise MM:SS
 * @param seconds - Total seconds
 * @returns Formatted string
 */
export function formatDurationFromSeconds(seconds: number): string {
  return formatDurationDisplay(seconds);
}
