import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Timer from './Timer'; // Assuming Timer.tsx is in the same directory

interface TimedClickerFieldProps {
  label: string;
  errorCount: number;
  onErrorChange: (newCount: number) => void;
  maxErrors: number;
  timerDuration?: number; // Made optional, if not provided, timer UI is hidden, error buttons always active
  soundIntervalSeconds?: number;
  hideTimer?: boolean; // New prop to explicitly hide timer UI
}

const TimedClickerField: React.FC<TimedClickerFieldProps> = ({
  label,
  errorCount,
  onErrorChange,
  maxErrors,
  timerDuration, // Can be undefined
  soundIntervalSeconds,
  hideTimer = false, // Default to false
}) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [errorInputValue, setErrorInputValue] = useState(errorCount.toString());

  // Sync input value when errorCount prop changes from parent
  useEffect(() => {
    setErrorInputValue(errorCount.toString());
  }, [errorCount]);

  const handleIncrementError = useCallback(() => {
    if (errorCount < maxErrors) {
      onErrorChange(errorCount + 1);
    }
  }, [errorCount, maxErrors, onErrorChange]);

  const handleResetError = useCallback(() => {
    onErrorChange(0);
  }, [onErrorChange]);

  const handleManualErrorInputChange = useCallback((text: string) => {
    setErrorInputValue(text);
  }, []);

  const handleManualErrorInputSubmit = useCallback(() => {
    let newCount = parseInt(errorInputValue, 10);
    if (isNaN(newCount) || newCount < 0) {
      newCount = 0;
    } else if (newCount > maxErrors) {
      newCount = maxErrors;
    }
    onErrorChange(newCount);
    // setErrorInputValue(newCount.toString()); // onErrorChange will trigger useEffect to update this
  }, [errorInputValue, maxErrors, onErrorChange]);

  // Timer handlers are only relevant if timerDuration is provided and timer is not hidden
  const showTimer = timerDuration && timerDuration > 0 && !hideTimer;

  const handleTimerStart = useCallback(() => {
    if (showTimer) setIsTimerRunning(true);
  }, [showTimer]);

  const handleTimerStop = useCallback(() => {
    if (showTimer) setIsTimerRunning(false);
  }, [showTimer]);
  
  const handleTimerComplete = useCallback(() => {
    if (showTimer) setIsTimerRunning(false);
  }, [showTimer]);

  const handleTimerReset = useCallback(() => {
    if (showTimer) setIsTimerRunning(false);
  }, [showTimer]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {showTimer && (
        <View style={styles.timerRow}>
          <Timer
            initial={0}
            running={isTimerRunning}
            onStart={handleTimerStart}
            onStop={handleTimerStop}
            onReset={handleTimerReset}
            duration={timerDuration} // Will be > 0 here
            onComplete={handleTimerComplete}
            soundIntervalSeconds={soundIntervalSeconds}
            style={styles.timerComponentStyle}
          />
        </View>
      )}

      <View style={styles.errorSection}>
        <TouchableOpacity 
          style={styles.errorButton}
          onPress={handleIncrementError}
          disabled={errorCount >= maxErrors} // No longer depends on timer state if timer is not shown
        >
          <Text style={styles.errorButtonText}>+ Ошибка</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.errorButton, styles.resetButton]} 
          onPress={handleResetError}
          disabled={errorCount === 0} // No longer depends on timer state
        >
          <Text style={[styles.errorButtonText, styles.resetButtonText]}>Сброс ошибок</Text>
        </TouchableOpacity>

        <View style={styles.errorInputContainer}>
          <Text style={styles.errorInputLabel}>Ошибок:</Text>
          <View style={styles.errorValueDisplayArea}> 
            <TextInput
              style={styles.errorValueInput}
              value={errorInputValue}
              onChangeText={handleManualErrorInputChange}
              onBlur={handleManualErrorInputSubmit}
              keyboardType="number-pad"
              maxLength={maxErrors.toString().length + 1} 
              editable={true} // Always editable
              selectTextOnFocus
            />
          </View>
          <Text style={styles.maxErrorText}> / {maxErrors}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    backgroundColor: '#fdfdfd',
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  timerRow: {
    marginBottom: 15,
    alignItems: 'center', // Center timer component
  },
  timerComponentStyle: {
    // Add specific styles if the Timer component itself needs adjustment
    // e.g., to ensure its internal elements are centered or scaled.
  },
  errorSection: {
    alignItems: 'center', 
    marginTop: 10, // Add some margin above the error section if the timer is close
  },
  errorButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 180, 
    alignItems: 'center',
    marginBottom: 12, // Adjusted marginBottom
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  errorButtonText: {
    color: '#fff',
    fontSize: 20, // Larger text
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#6c757d', // A different color for reset, e.g., grey
    marginBottom: 15, // Add margin below the reset button
  },
  resetButtonText: {
    // Potentially different text style for reset button if needed
  },
  errorInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginRight: 5,
  },
  errorInputLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  errorValueDisplayArea: {
    // Styles for the area displaying the TextInput, if any needed beyond TextInput itself
  },
  errorValueInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d9534f',
    minWidth: 40, // Ensure enough space for 1-2 digits
    textAlign: 'center',
    paddingVertical: 4, // Minimal padding for better look
    paddingHorizontal: 6,
    // backgroundColor: '#fff', // Optional: distinct background for input
    // borderRadius: 4,
  },
  maxErrorText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 2,
  },
});

export default TimedClickerField; 