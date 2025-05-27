import { Pressable, StyleSheet, Text, ViewStyle, StyleProp } from "react-native";

type SubmitButtonProps = {
  onPress: () => void;
  text: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const SubmitButton = ({ onPress, disabled, text, style }: SubmitButtonProps) => {
  return (
    <Pressable
      style={[
        styles.button, 
        disabled && styles.buttonDisabled, 
        style
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.buttonText,
        disabled && styles.buttonTextDisabled
      ]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    borderRadius: 5,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#CCCCCC",
    opacity: 0.6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonTextDisabled: {
    color: "#999999",
  },
});

export default SubmitButton;