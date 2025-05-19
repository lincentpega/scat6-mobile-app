import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface TimerProps {
  onChange?: (seconds: number) => void;
  initial?: number;
  style?: ViewStyle;
  running?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
}

const Timer: React.FC<TimerProps> = ({ onChange, initial = 0, style, running, onStart, onStop, onReset }) => {
  const [seconds, setSeconds] = useState(initial);
  const [internalRunning, setInternalRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Call onChange on mount and when initial changes
  useEffect(() => {
    setSeconds(initial);
    if (onChange) onChange(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // Determine if timer is running (controlled or uncontrolled)
  const isRunning = running ?? internalRunning;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (onChange) onChange(next);
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  // Button handlers
  const handleStart = () => {
    if (onStart) onStart();
    else setInternalRunning(true);
  };
  const handleStop = () => {
    if (onStop) onStop();
    else setInternalRunning(false);
  };
  const handleReset = () => {
    if (onReset) onReset();
    setSeconds(0);
    if (onChange) onChange(0);
    if (running === undefined) setInternalRunning(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.time}>{seconds} сек</Text>
      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.button} onPress={handleStart} disabled={isRunning}>
          <Text style={[styles.buttonText, isRunning && styles.disabled]}>Старт</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleStop} disabled={!isRunning}>
          <Text style={[styles.buttonText, !isRunning && styles.disabled]}>Стоп</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Сброс</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  time: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Timer; 