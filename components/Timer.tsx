import React, { useEffect, useRef, useState, memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { createAudioPlayer, AudioPlayer } from 'expo-audio';

interface TimerProps {
  onChange?: (seconds: number) => void;
  initial?: number;
  style?: ViewStyle;
  running?: boolean;
  onStart?: () => void;
  onStop?: () => void;
  onReset?: () => void;
  soundIntervalSeconds?: number;
  duration?: number;
  onComplete?: () => void;
}

const TimerComponent: React.FC<TimerProps> = ({
  onChange,
  initial = 0,
  style,
  running,
  onStart,
  onStop,
  onReset,
  soundIntervalSeconds,
  duration,
  onComplete,
}) => {
  const [seconds, setSeconds] = useState(initial);
  const [internalRunning, setInternalRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const soundObjectRef = useRef<AudioPlayer | null>(null);

  const onChangeRef = useRef(onChange);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setSeconds(initial);
  }, [initial]); 

  useEffect(() => {
    let playerToRelease: AudioPlayer | null = null;
    const hardcodedSoundAsset = require('../assets/timer.mp3');
    const loadSound = async () => {
      if (hardcodedSoundAsset && soundIntervalSeconds) { 
        try {
          const player = createAudioPlayer(hardcodedSoundAsset);
          soundObjectRef.current = player;
          playerToRelease = player;
        } catch (error: any) { 
          soundObjectRef.current = null;
        }
      } else {
        soundObjectRef.current = null;
      }
    };
    loadSound();
    return () => {
      try {
        playerToRelease?.remove();
      } catch (e: any) {
      }
      soundObjectRef.current = null;
    };
  }, [soundIntervalSeconds]);

  useEffect(() => {
    const localIsRunning = running ?? internalRunning;
    if (localIsRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => {
          const next = prev + 1;
          if (onChangeRef.current) {
            onChangeRef.current(next);
          }
          if (soundObjectRef.current && soundIntervalSeconds && next > 0 && next % soundIntervalSeconds === 0) {
            (async () => {
              try {
                if (soundObjectRef.current) {
                  await soundObjectRef.current.seekTo(0);
                  await soundObjectRef.current.play();
                }
              } catch (e: any) {
              }
            })();
          }
          if (duration && next >= duration) {
            clearInterval(intervalRef.current as number); 
            intervalRef.current = null;
            if (running === undefined) {
                setInternalRunning(false);
            }
            if (onCompleteRef.current) {
              setTimeout(() => {
                onCompleteRef.current?.();
              }, 0);
            }
            return duration; 
          }
          return next;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, internalRunning, duration, soundIntervalSeconds]);

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
    if (onChangeRef.current) onChangeRef.current(0);
    if (running === undefined) setInternalRunning(false);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.time}>{seconds} сек</Text>
      {(onStart || onStop || onReset || running === undefined) && (
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={styles.button} onPress={handleStart} disabled={(running ?? internalRunning)}>
            <Text style={[styles.buttonText, (running ?? internalRunning) && styles.disabled]}>Старт</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleStop} disabled={!(running ?? internalRunning)}>
            <Text style={[styles.buttonText, !(running ?? internalRunning) && styles.disabled]}>Стоп</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Сброс</Text>
          </TouchableOpacity>
        </View>
      )}
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

const Timer = memo(TimerComponent);

export default Timer; 