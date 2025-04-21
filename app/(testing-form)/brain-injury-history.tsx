import ScrollViewKeyboardAwareContainer from "@/components/Container";
import TextInputField from "@/components/TextInputField";
import { useState } from "react";
import { StyleSheet, View } from "react-native";

export default function BrainInjuryHistory() {
    const [numberOfBrainInjuries, setNumberOfBrainInjuries] = useState(0);
    const [lastBrainInjuryDate, setLastBrainInjuryDate] = useState("");
    const [symptoms, setSymptoms] = useState("");

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
            <View style={styles.inputContainer}>
                <View style={styles.inputField}>
                    <TextInputField
                        label="Количество диагностированных сотрясений мозга"
                        placeholder="Введите количество сотрясений"
                        keyboardType="number-pad"
                        required={true}
                        value={numberOfBrainInjuries ? numberOfBrainInjuries.toString() : ""}
                        onChangeText={(text) => setNumberOfBrainInjuries(parseInt(text))}
                    />
                </View>
                <View style={styles.inputField}>
                    <TextInputField
                        label="Когда было последнее сотрясение мозга"
                        placeholder="Введите дату последнего сотрясения"
                        value={lastBrainInjuryDate}
                        onChangeText={setLastBrainInjuryDate}
                        keyboardType="numbers-and-punctuation"
                        required={true}
                    />
                </View>
                <View style={styles.inputField}>
                    <TextInputField
                        label="Основные симптомы"
                        placeholder="Опишите основные симптомы"
                        multiline={true}
                        numberOfLines={4}
                        value={symptoms}
                        style={{ height: 100 }}
                        onChangeText={setSymptoms}
                        required={true}
                    />
                </View>
            </View>
        </ScrollViewKeyboardAwareContainer>
    );
}

const styles = StyleSheet.create({
    inputContainer: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    inputField: {
        width: "100%",
        marginTop: 20,
    },
});