import ScrollViewKeyboardAwareContainer from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import TextInputField from "@/components/TextInputField";
import CustomDatePicker from "@/components/CustomDatePicker";
import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import type { Sportsman } from "@/model/Sportsman";
import { useAthleteContext } from "@/contexts/AthleteContext";
import { fetchAthlete } from "@/services/apiService";

export default function BrainInjuryHistory() {
    const { athleteId } = useAthleteContext();
    const [athlete, setAthlete] = useState<Sportsman | null>(null);

    useEffect(() => {
        (async () => {
            if (athleteId) {
                try {
                    const serverAthleteData = await fetchAthlete(athleteId);
                    setAthlete(serverAthleteData);
                } catch (error) {
                    console.error("Error loading athlete data:", error);
                }
            }
        })();
    }, [athleteId]);

    const handleNextStep = async () => {
        if (athlete) {
            console.log("Moving to next step with brain injury history:", athlete);
        }
        router.push("/(testing-form)/observable-signs");
    }

    if (!athlete) {
        return null; // Loading state
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
                        value={athlete.numberOfBrainInjuries?.toString() ?? ''}
                        onChangeText={(text) => {
                            if (/^\d*$/.test(text)) {
                                setAthlete(prev => prev ? { ...prev, numberOfBrainInjuries: text ? parseInt(text) : undefined } : null);
                            }
                        }}
                    />
                </View>
                <View style={styles.inputField}>
                    <CustomDatePicker
                        label="Когда было последнее сотрясение мозга"
                        value={athlete.lastBrainInjuryDate}
                        onValueChange={(isoDate) => setAthlete(prev => prev ? { ...prev, lastBrainInjuryDate: isoDate } : null)}
                        placeholder="Выберите дату последнего сотрясения"
                        required={true}
                        limitToPastOrToday={true}
                    />
                </View>
                <View style={styles.inputField}>
                    <TextInputField
                        label="Дней восстановления после последнего сотрясения"
                        placeholder="Введите количество дней"
                        value={athlete.daysOfRecovery?.toString() ?? ''}
                        onChangeText={(text) => {
                            if (/^\d*$/.test(text)) {
                                setAthlete(prev => prev ? { ...prev, daysOfRecovery: text ? parseInt(text) : undefined } : null);
                            }
                        }}
                        keyboardType="number-pad"
                        required={true}
                    />
                </View>
                <View style={[styles.inputField, { marginBottom: 20 }]}>
                    <TextInputField
                        label="Основные симптомы"
                        placeholder="Опишите основные симптомы"
                        multiline={true}
                        numberOfLines={4}
                        value={athlete.brainInjurySymptoms ?? ''}
                        style={{ height: 100 }}
                        onChangeText={(text) => setAthlete(prev => prev ? { ...prev, brainInjurySymptoms: text } : null)}
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