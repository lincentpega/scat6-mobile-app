import { TextInput, StyleSheet, TextInputProps, View } from "react-native";
import InputLabel from "./InputLabel";

interface TextInputFieldProps extends TextInputProps {
  placeholder: string,
  value: string,
  onChangeText: (text: string) => void,
  label?: string,
  required?: boolean,
}

const TextInputField = (props: TextInputFieldProps) => {
  return (
    <View style={styles.container}>
      {props.label && <InputLabel label={props.label} required={props.required} />}
      <TextInput
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor="#7F7F7F"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    width: "100%",
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  }
});

export default TextInputField;