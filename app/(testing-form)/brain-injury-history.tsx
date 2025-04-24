import ScrollViewKeyboardAwareContainer from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import TextInputField from "@/components/TextInputField";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

export default function BrainInjuryHistory() {
    const [numberOfBrainInjuries, setNumberOfBrainInjuries] = useState("");
    const [lastBrainInjuryDate, setLastBrainInjuryDate] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [daysOfRecovery, setDaysOfRecovery] = useState("");

    const handleNextStep = () => {
        console.log("submit brain injury history");
        router.push("/(testing-form)/observable-signs");
    }

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
            <View style={styles.inputContainer}>
                <View style={styles.inputField}>
                    <TextInputField
                        label="Количество диагностированных сотрясений мозга"
                        placeholder="Введите количество сотрясений"
                        keyboardType="number-pad"
                        required={true}
                        value={numberOfBrainInjuries}
                        onChangeText={(text) => {
                            if (/^\d*$/.test(text)) {
                                setNumberOfBrainInjuries(text);
                            }
                        }}
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
                        label="Дней восстановления после последнего сотрясения"
                        placeholder="Введите количество дней"
                        value={daysOfRecovery}
                        onChangeText={setDaysOfRecovery}
                        keyboardType="numbers-and-punctuation"
                        required={true}
                    />
                </View>
                <View style={[styles.inputField, { marginBottom: 20 }]}>
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
                <SubmitButton style={{ marginBottom: 20 }} onPress={handleNextStep} text="Следующий шаг" />
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
        marginBottom: 20,
    },
});