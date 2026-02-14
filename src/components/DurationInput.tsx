import React, { useState, useEffect, useRef } from 'react';
import { parseDurationInput, validateDuration, durationToSeconds, secondsToDuration } from '../utils/durationUtils';

interface DurationInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function DurationInput({
  value,
  onChange,
  placeholder = '00:00',
  disabled = false,
  className = ''
}: DurationInputProps) {
  const [localValue, setLocalValue] = useState(value || '');
  const [isInvalid, setIsInvalid] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    setIsInvalid(false);
  };

  const handleBlur = () => {
    if (!localValue) {
      onChange('');
      setIsInvalid(false);
      return;
    }

    const formatted = parseDurationInput(localValue);

    if (formatted && validateDuration(formatted)) {
      setLocalValue(formatted);
      onChange(formatted);
      setIsInvalid(false);
    } else {
      setIsInvalid(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();

      const currentSeconds = localValue ? durationToSeconds(localValue) : 0;
      const increment = e.key === 'ArrowUp' ? 1 : -1;
      const newSeconds = Math.max(0, currentSeconds + increment);
      const newDuration = secondsToDuration(newSeconds);

      setLocalValue(newDuration);
      onChange(newDuration);
      setIsInvalid(false);
    } else if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const handleFocus = () => {
    setIsInvalid(false);
  };

  const baseClasses = `w-full px-2 py-2 rounded-lg bg-solarized-base3 text-solarized-base02 
    border transition-colors font-bold text-center
    placeholder:text-gray-400 placeholder:font-normal
    focus:outline-none focus:ring-2 focus:ring-solarized-blue focus:border-transparent`;

  const stateClasses = isInvalid
    ? 'border-solarized-red'
    : 'border-solarized-base1 hover:border-solarized-base0';

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : '';

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={localValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${disabledClasses} ${className}`}
        inputMode="numeric"
        maxLength={5}
      />
      {isInvalid && (
        <div className="absolute -bottom-5 left-0 text-xs text-red">
          Invalid format (use MM:SS)
        </div>
      )}
    </div>
  );
}
