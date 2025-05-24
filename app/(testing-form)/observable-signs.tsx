import CheckboxField from "@/components/CheckboxField";
import ScrollViewKeyboardAwareContainer from "@/components/Container";
import SubmitButton from "@/components/SubmitButton";
import { StyleSheet, View, Text } from "react-native";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import type { ImmediateAssessment } from "@/model/ImmediateAssessment";
import { saveObservableSigns, loadObservableSigns } from "@/services/immediateAssessmentStorageService";

export default function ObservableSigns() {
    const [signs, setSigns] = useState<ImmediateAssessment.ObservableSigns>({
        immobile: false,
        unprotectedFall: false,
        unsteadyGait: false,
        disorientation: false,
        vacantStare: false,
        facialInjury: false,
        seizure: false,
        highRiskMechanism: false,
    });

    // Load saved observable signs on mount
    useEffect(() => {
        (async () => {
            const saved = await loadObservableSigns();
            if (saved) setSigns(saved);
        })();
    }, []);

    const handleChange = (key: keyof typeof signs) => {
        setSigns((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async () => {
        await saveObservableSigns(signs);
        router.push("/(testing-form)/neck-spine-assessment");
    };

    return (
        <ScrollViewKeyboardAwareContainer contentContainerStyle={{ alignItems: "flex-start" }}>
            <View style={styles.inputContainer}>
                <Text style={styles.guideText}>Отметьте все, что применимо</Text>
                <CheckboxField label="Лежит неподвижно на игровой поверхности" checked={signs.immobile} onChange={() => handleChange('immobile')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Незащищенное падение на поверхность" checked={signs.unprotectedFall} onChange={() => handleChange('unprotectedFall')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Неуверенная походка/ дисбаланс/ моторная несогласованность: спотыкание, замедленные, затрудненные движения" checked={signs.unsteadyGait} onChange={() => handleChange('unsteadyGait')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Дезориентация или частичная потеря ориентации, или невозможность дать правильные ответы на вопросы" checked={signs.disorientation} onChange={() => handleChange('disorientation')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Бессмысленный или отсутствующий взгляд" checked={signs.vacantStare} onChange={() => handleChange('vacantStare')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Лицевые повреждения в результате травмы головы" checked={signs.facialInjury} onChange={() => handleChange('facialInjury')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Эпилептический приступ" checked={signs.seizure} onChange={() => handleChange('seizure')} style={{ borderBottomWidth: 0 }} />
                <CheckboxField label="Механизм высокого риска получения травмы (зависит от вида спорта)" checked={signs.highRiskMechanism} onChange={() => handleChange('highRiskMechanism')} />
                <SubmitButton text="Далее" onPress={handleSubmit} style={{ marginTop: 20 }} />
            </View>
        </ScrollViewKeyboardAwareContainer>
    );
}

const styles = StyleSheet.create({
    guideText: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    inputContainer: {
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    inputField: {
        width: "100%",
        marginTop: 20,
    },
    checkBoxContainer: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "grey",
    },
});