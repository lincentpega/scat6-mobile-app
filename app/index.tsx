import TextInputField from "@/components/TextInputField";
// import { startTesting } from "@/services/form-service";
import {useState} from "react";
import {StyleSheet, Text, View} from "react-native";
import {router} from "expo-router";
import KeyboardAwareContainer from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";

export default function HomeScreen() {
  const [username, setUsername] = useState("");

  const beginTesting = async () => {
    console.log("beginTesting");
    // await startTesting(username);
    router.push("/(testing-form)/red-flags");
  }

  return (
    <KeyboardAwareContainer contentContainerStyle={styles.content}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>SCAT6</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInputField style={{marginBottom: 8}} placeholder="Введите имя пользователя" value={username} onChangeText={setUsername}/>
          <SubmitButton onPress={beginTesting} text="Начать тестирование" disabled={username.length === 0}/>
        </View>
    </KeyboardAwareContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  headerContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 70,
  },
  headerText: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#000000",
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  }
});
