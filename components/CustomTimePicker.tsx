import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import InputLabel from './InputLabel';

interface CustomTimePickerProps {
  label: string;
  value: string | undefined; // HH:mm string
  onValueChange: (timeString: string | undefined) => void;
  placeholder?: string;
  required?: boolean;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({
  label,
  value,
  onValueChange,
  placeholder = 'Select time',
  required,
}) => {
  const [pickerTimeValue, setPickerTimeValue] = useState<Date>(new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    if (value && typeof value === 'string' && value.trim()) {
      const parts = value.trim().split(':');
      if (parts.length === 2) {
        const hours = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);
        if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
          const dateForPicker = new Date();
          dateForPicker.setHours(hours, minutes, 0, 0);
          setPickerTimeValue(dateForPicker);
          return;
        }
      }
    }
    // If value is invalid or not set, default picker to current time
    setPickerTimeValue(new Date()); 
  }, [value]);

  const displayTimeFormatted = () => {
    if (value && value.trim()) { // Value is already expected to be HH:mm or undefined
      return value;
    }
    return placeholder;
  };

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
        setIsPickerVisible(false);
    }

    if (event.type === 'set' && selectedDate) {
      setPickerTimeValue(selectedDate);
      onValueChange(selectedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      if (Platform.OS === 'ios') {
        setIsPickerVisible(false);
      }
    } else if (event.type === 'dismissed' && Platform.OS === 'ios') {
        setIsPickerVisible(false);
    }
  };

  const isPlaceholder = !value || !value.trim(); // Check if the value prop is falsy or empty

  return (
    <View style={styles.inputFieldContainer}>
      <InputLabel label={label} required={required} />
      <Pressable 
        style={styles.pressableInput}
        onPress={() => setIsPickerVisible(true)}
      >
        <Text 
          style={[
            styles.inputText,
            isPlaceholder && styles.placeholderText // Apply placeholder color if needed
          ]}
        >
          {displayTimeFormatted()}
        </Text>
      </Pressable>
      {isPickerVisible && (
        <DateTimePicker
          value={pickerTimeValue}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          is24Hour={true}
          locale="ru-RU"
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputFieldContainer: {
    width: "100%",
    marginBottom: 20,
  },
  pressableInput: { 
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#000000", 
    borderRadius: 5,    
    paddingHorizontal: 15, 
    justifyContent: 'center', 
    backgroundColor: '#FFFFFF',
  },
  inputText: { 
    fontSize: 16,
    color: '#000000', // Default color for actual value
  },
  placeholderText: {
    color: '#7F7F7F', // Placeholder color
  },
});

export default CustomTimePicker; 