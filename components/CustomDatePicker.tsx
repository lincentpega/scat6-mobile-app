import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import InputLabel from './InputLabel'; // Assuming InputLabel is in the same directory or adjust path

interface CustomDatePickerProps {
  label: string;
  value: string | undefined; // ISO date string
  onValueChange: (isoDateString: string | undefined) => void;
  placeholder?: string;
  required?: boolean;
  limitToPastOrToday?: boolean; // New prop
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  value,
  onValueChange,
  placeholder = 'Select date',
  required,
  limitToPastOrToday = false, // Default to false
}) => {
  const [pickerDateValue, setPickerDateValue] = useState<Date>(new Date());
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  useEffect(() => {
    if (value && value.trim() && !isNaN(new Date(value).getTime())) {
      let initialDate = new Date(value);
      // If limitToPastOrToday is true, and initialDate is in the future, clamp it to now for the picker UI.
      // The actual saved value will still be what was passed until a new selection is made.
      if (limitToPastOrToday && initialDate > new Date()) {
        initialDate = new Date();
      }
      setPickerDateValue(initialDate);
    } else {
      // Default to today if no value or invalid value
      setPickerDateValue(new Date()); 
    }
  }, [value, limitToPastOrToday]);

  const displayDateFormatted = () => {
    if (value && value.trim() && !isNaN(new Date(value).getTime())) {
      return new Date(value).toLocaleDateString('ru-RU');
    }
    return placeholder;
  };

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
        setIsPickerVisible(false);
    }

    if (event.type === 'set' && selectedDate) {
      // Ensure selectedDate respects limitToPastOrToday before calling onValueChange
      let finalDate = selectedDate;
      if (limitToPastOrToday && selectedDate > new Date()) {
        finalDate = new Date(); // Clamp to now if a future date was somehow selected
      }
      setPickerDateValue(finalDate);
      onValueChange(finalDate.toISOString());
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
          {displayDateFormatted()}
        </Text>
      </Pressable>
      {isPickerVisible && (
        <DateTimePicker
          value={pickerDateValue}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          locale="ru-RU"
          maximumDate={limitToPastOrToday ? new Date() : undefined} // Apply maximumDate
          onChange={handlePickerChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputFieldContainer: {
    width: "100%",
    marginBottom: 20, // Matches athlete-info.tsx inputField style
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

export default CustomDatePicker; 